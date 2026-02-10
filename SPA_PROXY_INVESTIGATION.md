# SPA + Netlify Proxy Investigation Summary

**Date:** 2026-02-10
**Issue:** Netlify 200 proxy rewrites not working with Docusaurus client-side routing

---

## Problem Statement

When clicking links in the Docusaurus site to `/nextflow/*` or `/platform-api/*` paths, users get 404 errors even though these paths are configured as Netlify proxy rewrites (200 status). However, typing the URLs directly or refreshing the page works correctly.

### Netlify Redirects Configuration

```
# static/_redirects
/platform-api/* https://seqera-docs-api.netlify.app/platform-api/:splat 200!
/nextflow/* https://docs-migration.netlify.app/nextflow/:splat 200!
```

---

## Root Cause Analysis

### How Netlify Proxies Work

1. **Server-side only**: Netlify proxy rewrites operate at the HTTP server level
2. **Requires full page load**: The browser must make an actual HTTP request to the Netlify server
3. **Cannot intercept client-side navigation**: If JavaScript handles navigation, Netlify never sees the request

### Why SPAs Break This

```
✅ Direct URL:     Browser → Netlify Server → Proxy works
❌ Clicked link:   Browser → Docusaurus Router → 404 (never reaches Netlify)
```

**The fundamental conflict:**
- Docusaurus (SPA) intercepts navigation before it reaches the server
- Netlify proxies only work on server requests
- No server request = no proxy

### Netlify Documentation Confirms This

From [Netlify Support Forums](https://answers.netlify.com/t/rewrite-with-proxy-gives-404-with-nuxt-on-spa-but-works-when-refreshing-with-the-same-url/102258):

> "When navigating through the app, the browser doesn't make an HTTP request for the new route—it's handled internally by the JavaScript framework. The rewrite rule never gets triggered because no server request occurs."

---

## Investigation Findings

### 1. Docusaurus Preset Configuration

**Location:** `node_modules/@seqera/docusaurus-preset-seqera/lib/index.js`

**Problem Found (Line 136-139):**
```javascript
{
  label: 'Nextflow',
  to: '/nextflow/',  // ❌ Uses client-side routing
}
```

**Correct Configuration (Line 188-189 in source):**
```typescript
{
  label: 'Nextflow',
  href: '/nextflow/',  // ✅ Forces full page load
}
```

**Status:** Fixed in preset source but not published (version 1.0.12 still has old `to` config)

### 2. Theme Component Hardcoded Links

**Location:** `packages/docusaurus-theme-seqera/src/theme/Navbar/Content/index.tsx`

**Problem Found (Lines 129-134):**
```tsx
<Link
  className="navbar__link ml-8 font-normal"
  href={'/platform-api'}  // ❌ Docusaurus Link component = client-side routing
  aria-label="Platform API">
  Platform API
</Link>
```

**Impact:**
- Platform API link bypasses config override
- Always uses client-side routing
- Prevents proxy from working

### 3. Homepage Links

**Location:** `packages/docusaurus-preset-seqera/lib/theme/Homepage/index.js`

**Status:** ✅ Already correct! Uses `<a href>` tags (Line 96)
```javascript
{
  href: '/nextflow/',  // ✅ Regular anchor tag
  icon: <IconNextflow />,
  title: 'Nextflow',
  description: 'Open-source orchestrator for deploying workflows',
}
```

### 4. Additional Bug Found: ESM Module Error

**Location:** `packages/docusaurus-preset-seqera/src/index.ts:485`

**Problem:**
```typescript
rehypePlugins: [(await require('rehype-katex')).default],  // ❌ Can't require() ES modules
```

**Fix:**
```typescript
rehypePlugins: [(await import('rehype-katex')).default],  // ✅ Use dynamic import
```

---

## Solutions Implemented

### Temporary Fix (Applied to docs site)

**File:** `docs/docusaurus.config.js`

```javascript
themeConfig: getSeqeraThemeConfig({
  prism: {
    additionalLanguages: ['nextflow', 'groovy', 'java', 'bash', 'yaml', 'json'],
  },
  navbar: {
    items: [
      { label: 'Cloud', href: '/platform-cloud/' },
      { label: 'Enterprise', href: '/platform-enterprise/' },
      { label: 'Nextflow', href: '/nextflow/' },  // ✅ Override with href
      { label: 'MultiQC', href: '/multiqc/' },
      { label: 'Wave', href: '/wave/' },
      { label: 'Fusion', href: '/fusion/' },
    ],
  },
}),
```

**Also disabled rspack** to avoid dependency issues:
```javascript
future: {
  experimental_faster: {
    rspackBundler: false,  // Disabled to avoid @docusaurus/faster issues
  },
},
```

### Permanent Fix (Requires publishing)

#### 1. Preset Configuration Fix
- ✅ Already correct in source (uses `href`)
- ❌ Not published yet

#### 2. Theme Component Fix
**Still needs to be applied:**

```diff
# packages/docusaurus-theme-seqera/src/theme/Navbar/Content/index.tsx

- <Link
-   className="navbar__link ml-8 font-normal"
-   href={'/platform-api'}
-   aria-label="Platform API">
-   Platform API
- </Link>
+ <a
+   className="navbar__link ml-8 font-normal"
+   href="/platform-api"
+   aria-label="Platform API">
+   Platform API
+ </a>
```

Apply same fix to Changelog link (lines 135-140).

#### 3. ESM Fix
- ✅ Applied to preset source
- ❌ Not published yet

---

## Key Takeaways

### The `to` vs `href` Distinction in Docusaurus

| Property | Behavior | Use Case |
|----------|----------|----------|
| `to` | Client-side routing via `<Link>` | Internal Docusaurus pages |
| `href` | Full page load via `<a>` | External sites, proxied paths |

### When Netlify Proxies Work

✅ **Works:**
- Direct URL navigation
- Page refresh
- Links using `<a href>` tags
- Links using `href` in navbar config

❌ **Doesn't work:**
- Links using Docusaurus `<Link>` component
- Links using `to` in navbar config
- Client-side route changes

### What This Means

**200 status rewrites (proxies) are fundamentally incompatible with SPA client-side routing.**

You must choose:
1. **SPA routing** → Use `to` for internal content
2. **Netlify proxy** → Use `href` to force full page load

---

## Deployment Checklist

### Option A: Deploy Current Workaround
- [x] Navbar override applied in `docusaurus.config.js`
- [x] rspack disabled
- [ ] Test in production
- **Limitation:** Platform API hardcoded link still broken

### Option B: Publish Preset Update (Recommended)

#### In Preset Repository:
```bash
cd /Users/chris.hakkaart/workspace/architecture/docusaurus-preset-seqera

# 1. Fix theme component (apply diff above)
# Edit: packages/docusaurus-theme-seqera/src/theme/Navbar/Content/index.tsx

# 2. Verify ESM fix is applied
# Check: packages/docusaurus-preset-seqera/src/index.ts:485

# 3. Build preset
cd packages/docusaurus-preset-seqera
npm run build

# 4. Bump version
npm version patch  # Creates 1.0.13

# 5. Publish
npm publish

# 6. Build theme
cd ../docusaurus-theme-seqera
npm run build
npm version patch
npm publish
```

#### In Docs Repository:
```bash
cd /Users/chris.hakkaart/workspace/architecture/docs

# 1. Update preset
npm install @seqera/docusaurus-preset-seqera@latest
npm install @seqera/docusaurus-theme-seqera@latest

# 2. Remove navbar override from docusaurus.config.js
# (Preset now has correct config)

# 3. Re-enable rspack (optional)
rspackBundler: true,

# 4. Test locally
npm run start

# 5. Deploy
npm run build
# Deploy to Netlify
```

---

## Testing Verification

### Local Testing (Dev Server)
1. Start server: `npm run start`
2. Visit: http://localhost:3000
3. Click "Nextflow" in navbar
4. Verify: Should show loading indicator (full page load)
5. Check DevTools Network tab: Should see document request

### Production Testing (Netlify)
1. Deploy to Netlify
2. Visit: https://docs.seqera.io
3. Click "Nextflow" in navbar
4. Verify: URL shows `/nextflow/*` and content loads from proxy
5. Check Network tab: Should show 200 status from proxy

### What to Look For

✅ **Working:**
- Full page reload when clicking navbar links
- Content loads from external domain
- Network tab shows document request
- No 404 errors

❌ **Still broken:**
- Instant navigation (no page reload)
- 404 error page
- Network tab shows XHR/fetch request
- "Page not found" from Docusaurus

---

## Files Modified

### Docs Repository
- `docusaurus.config.js` - Added navbar override, disabled rspack

### Preset Repository (Pending Publish)
- `packages/docusaurus-preset-seqera/src/index.ts` - Fixed ESM import
- `packages/docusaurus-theme-seqera/src/theme/Navbar/Content/index.tsx` - Needs Link → a tag fix

---

## Related Documentation

- [Netlify Rewrites and Proxies](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/)
- [Netlify Support: SPA + Proxy Issue](https://answers.netlify.com/t/rewrite-with-proxy-gives-404-with-nuxt-on-spa-but-works-when-refreshing-with-the-same-url/102258)
- [Docusaurus Navbar Configuration](https://docusaurus.io/docs/api/themes/configuration#navbar)
- [Docusaurus Link Component](https://docusaurus.io/docs/docusaurus-core#link)

---

## Questions & Answers

### Q: Can we use both SPA routing AND proxies?
**A:** No. They are fundamentally incompatible. You must force full page loads for proxied paths.

### Q: Why does the homepage work?
**A:** It uses `<a href>` tags instead of `<Link>` components, which forces full page loads.

### Q: Will this affect SEO?
**A:** No. Full page loads are actually better for SEO than client-side navigation.

### Q: What about the 301 redirects in the file?
**A:** Those work fine because redirects (3xx status) are handled differently than proxies (200 status). Redirects tell the browser to navigate to a new URL, which always triggers a full page load.

### Q: Why not just serve content locally?
**A:** The `/nextflow` and `/platform-api` content is maintained in separate repositories and deployed to separate Netlify sites. Proxying allows them to appear as part of docs.seqera.io without duplicating content.

---

## Recommendations

1. **Publish preset update** with all fixes
2. **Apply theme component fix** (Link → a tag)
3. **Update docs site** to use new preset version
4. **Remove temporary workarounds** from `docusaurus.config.js`
5. **Test thoroughly** in production before announcing

---

*Investigation completed: 2026-02-10*
*Status: Temporary fix applied, permanent fix ready for publishing*
