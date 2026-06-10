const path = require("path");
const platformEnterpriseVersions = require("./platform-enterprise_versions.json");
import "dotenv/config";
import platform_enterprise_latest_version from "./platform-enterprise_latest_version.js";
import {
  createSeqeraConfig,
  getSeqeraThemeConfig,
  getSeqeraPresetOptions
} from "@seqera/docusaurus-preset-seqera";

// Build the search filter_by dynamically so old platform-enterprise versions are
// excluded automatically whenever a new version is added to versions.json.
// versions.json is ordered newest-first; index 0 is the current/latest version.
const oldEnterpriseVersionTags = platformEnterpriseVersions
  .slice(1)
  .map((v) => `docs-platform-enterprise-${v}`);
const searchFilterBy = `docusaurus_tag:!=[default,doc_tag_doc_list,blog_posts_list,blog_tags_posts,doc_tags_list,blog_tags_list${oldEnterpriseVersionTags.length ? `,${oldEnterpriseVersionTags.join(",")}` : ""}]`;

// Read an env var as a boolean: unset, "", "false", "0", "no", "off" → false;
// anything else → true. A bare `process.env.X ?` check treats the string
// "false" as truthy, so this avoids EXCLUDE_*="false" silently excluding.
const envFlag = (name) => {
  const v = (process.env[name] ?? "").trim().toLowerCase();
  return v !== "" && v !== "false" && v !== "0" && v !== "no" && v !== "off";
};

export default async function createConfigAsync() {

  const changelog = {
    blogTitle: "Seqera Changelog",
    blogDescription: "Blog",
    blogSidebarCount: 5000,
    blogSidebarTitle: "Changelog",
    path: "changelog",
    routeBasePath: "/changelog",
    //processBlogPosts: () => ({}),
    include: ["**/*.{md,mdx}"],
    showReadingTime: false,
    feedOptions: {
      type: "all", // 'rss', 'atom', or both
      title: "Seqera Changelog",
      description: "Stay updated with our blog posts!",
      copyright: `Copyright © ${new Date().getFullYear()} Seqera`,
    },
    onUntruncatedBlogPosts: "ignore",
  };

  const docs_platform_enterprise = [
    "@docusaurus/plugin-content-docs",
    {
      id: "platform-enterprise",
      routeBasePath: "/platform-enterprise",
      path: "platform-enterprise_docs",
      // For PR Previews we want to see the latest doc-set with expected changes.
      includeCurrentVersion: envFlag("INCLUDE_NEXT"),
      lastVersion: platform_enterprise_latest_version,
      remarkPlugins: [
        (await import("remark-code-import")).default,
        (await require("remark-math")).default,
        (await import("docusaurus-remark-plugin-tab-blocks")).default,
        (await require("remark-yaml-to-table")).default,
      ],
      rehypePlugins: [require("rehype-katex")],
      editUrl: "https://github.com/seqeralabs/docs/tree/master/",
      sidebarPath: "platform-enterprise_docs/enterprise-sidebar.json",
    },
  ];

  const docs_platform_api = [
    "@docusaurus/plugin-content-docs",
    {
      id: "platform-api",
      routeBasePath: "/platform-api",
      path: "platform-api-docs/docs",
      remarkPlugins: [(await require("remark-yaml-to-table")).default],
      sidebarPath: "platform-api-docs/docs/sidebar/sidebar.js",
      docItemComponent: "@theme/ApiItem",
    },
  ];

  const docs_platform_cli = [
    "@docusaurus/plugin-content-docs",
    {
      id: "platform-cli",
      routeBasePath: "/platform-cli",
      path: "platform-cli-docs/docs",
      remarkPlugins: [
        (await import("remark-code-import")).default,
        (await require("remark-math")).default,
        (await import("docusaurus-remark-plugin-tab-blocks")).default,
        (await require("remark-yaml-to-table")).default,
      ],
      rehypePlugins: [require("rehype-katex")],
      sidebarPath: "platform-cli-docs/docs/sidebar/sidebar.js",
      editUrl: "https://github.com/seqeralabs/docs/tree/master/",
    },
  ];

  const docs_platform_cloud = [
    "@docusaurus/plugin-content-docs",
    {
      id: "platform-cloud",
      routeBasePath: "/platform-cloud",
      path: "platform-cloud/docs",
      remarkPlugins: [
        (await import("remark-code-import")).default,
        (await require("remark-math")).default,
        (await import("docusaurus-remark-plugin-tab-blocks")).default,
        (await require("remark-yaml-to-table")).default,
      ],
      rehypePlugins: [require("rehype-katex")],
      editUrl: "https://github.com/seqeralabs/docs/tree/master/",
      sidebarPath: "./platform-cloud/cloud-sidebar.json",
    },
  ];

  const docs_multiqc = [
    "@docusaurus/plugin-content-docs",
    {
      id: "multiqc",
      routeBasePath: "/multiqc",
      path: "multiqc_docs/multiqc_repo/docs/markdown",
      remarkPlugins: [
        (await import("remark-code-import")).default,
        (await require("remark-math")).default,
        (await import("docusaurus-remark-plugin-tab-blocks")).default,
        (await require("remark-yaml-to-table")).default,
      ],
      rehypePlugins: [require("rehype-katex")],
      editUrl: ({ docPath }) => {
        return `https://github.com/MultiQC/MultiQC/blob/main/docs/markdown/${docPath.replace("multiqc_docs/multiqc_repo/docs", "")}`;
      },
      sidebarPath: "./multiqc_docs/sidebar.js",
    },
  ];
  const docs_fusion = [
    "@docusaurus/plugin-content-docs",
    {
      id: "fusion",
      routeBasePath: "/fusion",
      path: "fusion_docs",
      remarkPlugins: [
        (await import("remark-code-import")).default,
        (await require("remark-math")).default,
        (await import("docusaurus-remark-plugin-tab-blocks")).default,
        (await require("remark-yaml-to-table")).default,
      ],
      rehypePlugins: [require("rehype-katex")],
      editUrl: "https://github.com/seqeralabs/docs/tree/master/",
      sidebarPath: "./fusion_docs/sidebar.json",
    },
  ];

  const docs_wave = [
    "@docusaurus/plugin-content-docs",
    {
      id: "wave",
      routeBasePath: "/wave",
      path: "wave_docs/wave_repo/docs",
      remarkPlugins: [
        (await import("remark-code-import")).default,
        (await require("remark-math")).default,
        (await import("docusaurus-remark-plugin-tab-blocks")).default,
        (await require("remark-yaml-to-table")).default,
        (await import("remark-deflist")).default,
      ],
      rehypePlugins: [require("rehype-katex")],
      editUrl: ({ docPath }) => {
        return `https://github.com/seqeralabs/wave/blob/master/docs/${docPath.replace("wave_docs/wave_repo/docs", "")}`;
      },
      sidebarPath: "./wave_docs/sidebar.json",
    },
  ];

  console.log(
    "\n  EXCLUDE_CHANGELOG: " + envFlag("EXCLUDE_CHANGELOG"),
    "\n  EXCLUDE_PLATFORM_ENTERPRISE: " + envFlag("EXCLUDE_PLATFORM_ENTERPRISE"),
    "\n  EXCLUDE_PLATFORM_CLOUD: " + envFlag("EXCLUDE_PLATFORM_CLOUD"),
    "\n  EXCLUDE_PLATFORM_API: " + envFlag("EXCLUDE_PLATFORM_API"),
    "\n  EXCLUDE_PLATFORM_CLI: " + envFlag("EXCLUDE_PLATFORM_CLI"),
    "\n  EXCLUDE_MULTIQC: " + envFlag("EXCLUDE_MULTIQC"),
    "\n  EXCLUDE_FUSION: " + envFlag("EXCLUDE_FUSION"),
    "\n  EXCLUDE_WAVE: " + envFlag("EXCLUDE_WAVE"),
    "\n  INCLUDE_NEXT: " + envFlag("INCLUDE_NEXT"),
  );

  return createSeqeraConfig({
    title: "Seqera Docs",
    tagline: "Documentation for Seqera products",
    url: "https://docs.seqera.io",
    /*
     * Enable faster Docusaurus optimizations (experimental v4 features)
     * Reference: https://github.com/facebook/docusaurus/issues/10556
     *
     * WARNING: swcJsMinimizer & lightningCssMinimizer are disabled due to memory issues
     * - Cause excessive memory usage leading to build failures
     * - The believe is that our 22k of OpenAPI docs causes this issue due to the way they are generated.
     * - See: https://github.com/PaloAltoNetworks/docusaurus-openapi-docs/issues/1025
     *
     * These optimizations may require additional configuration when memory issues are resolved.
     */

    future: {
      experimental_faster: {
        swcJsLoader: false,
        swcJsMinimizer: false,
        swcHtmlMinimizer: false,
        lightningCssMinimizer: false,
        rspackBundler: true,
        rspackPersistentCache: false,
        mdxCrossCompilerCache: false,
        // Render pages on a recycling worker-thread pool: parallelizes SSG
        // across CPUs and frees retained memory between tasks. Pool size and
        // recycle threshold set via the DOCUSAURUS_SSG_WORKER_THREAD_* env vars
        // in netlify.toml.
        ssgWorkerThreads: true,
      },
    },

    // If you aren't using GitHub pages, you don't need these.
    organizationName: "seqeralabs", // Usually your GitHub org/user name.
    projectName: "docs", // Usually your repo name.

    onBrokenLinks:
      process.env.FAIL_ON_BROKEN_LINKS === "true" ? "throw" : "warn",
    onBrokenAnchors:
      process.env.FAIL_ON_BROKEN_LINKS === "true" ? "throw" : "warn",

    // TODO: markdown.hooks not supported in Docusaurus 3.8.1 - upgrade Docusaurus or remove
    // markdown: {
    //   hooks: {
    //     onBrokenMarkdownLinks:
    //       process.env.FAIL_ON_BROKEN_LINKS === "true" ? "throw" : "warn",
    //   },
    // },

    markdown: {
      // The vendored MultiQC `config_schema.md` is auto-generated from a Python
      // schema and contains literal `{...}` examples and `<details>` blocks
      // around fenced code that the MDX parser rejects. Force CommonMark for
      // that file so its content renders as plain markdown + HTML.
      parseFrontMatter: async ({ filePath, fileContent, defaultParseFrontMatter }) => {
        const result = await defaultParseFrontMatter({ filePath, fileContent });
        if (filePath.endsWith("multiqc_docs/multiqc_repo/docs/markdown/config_schema.md")) {
          result.frontMatter.mdx = { ...(result.frontMatter.mdx || {}), format: "md" };
        }
        return result;
      },
    },

    customFields: {
      // Put your custom environment here
    },

    clientModules: [
    require.resolve('./src/client-modules/cross-site-nav.js'),
    require.resolve('./src/client-modules/posthog-search.js'),
    require.resolve('./src/client-modules/katex-css.js'),
    ],


    presets: [
      [
        "@seqera/docusaurus-preset-seqera",
        await getSeqeraPresetOptions({
          blog: envFlag("EXCLUDE_CHANGELOG") ? false : changelog,
          docs: false,
          theme: {
            customCss: require.resolve("./src/custom.css"),
          },
          // The OpenAPI preset, the API content plugin, and llms-api all read
          // from platform-api-docs/docs, so one EXCLUDE_PLATFORM_API lever gates
          // all three.
          openapi: envFlag("EXCLUDE_PLATFORM_API")
            ? false
            : {
                id: "api",
                docsPluginId: "platform-api",
                config: {
                  platform: {
                    specPath: "platform-api-docs/scripts/specs/seqera-api-latest-decorated.yml",
                    outputDir: "platform-api-docs/docs",
                    sidebarOptions: {
                      groupPathsBy: "tag",
                    },
                  },
                },
              },
          gtag: {
            trackingID: "G-NR1CNM213G",
            anonymizeIP: true,
          },
          googleTagManager: {
            containerId: "GTM-MBCJKK4",
          },
        }),
      ],
    ],
    plugins: [
      envFlag("EXCLUDE_PLATFORM_ENTERPRISE") ? null : docs_platform_enterprise,
      envFlag("EXCLUDE_PLATFORM_CLOUD") ? null : docs_platform_cloud,
      envFlag("EXCLUDE_PLATFORM_API") ? null : docs_platform_api,
      envFlag("EXCLUDE_PLATFORM_CLI") ? null : docs_platform_cli,
      envFlag("EXCLUDE_MULTIQC") ? null : docs_multiqc,
      envFlag("EXCLUDE_FUSION") ? null : docs_fusion,
      envFlag("EXCLUDE_WAVE") ? null : docs_wave,

      ['docusaurus-plugin-llms', {
        id: 'llms-enterprise',
        docsDir: 'platform-enterprise_docs',
        llmsTxtFilename: 'llms-enterprise.txt',
        llmsFullTxtFilename: 'llms-enterprise-full.txt',
        title: 'Seqera Platform Enterprise',
        description: 'Documentation for Seqera Platform Enterprise.',
        rootContent: 'This file contains links to Seqera Platform Enterprise documentation following the llmstxt.org standard.',
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        includeBlog: false,
        excludeImports: true,
        removeDuplicateHeadings: true,
        ignoreFiles: ['**/tags', '**/tags/**'],
        processingBatchSize: 50,
      }],
      ['docusaurus-plugin-llms', {
        id: 'llms-cloud',
        docsDir: 'platform-cloud/docs',
        llmsTxtFilename: 'llms-cloud.txt',
        llmsFullTxtFilename: 'llms-cloud-full.txt',
        title: 'Seqera Platform Cloud',
        description: 'Documentation for Seqera Platform Cloud.',
        rootContent: 'This file contains links to Seqera Platform Cloud documentation following the llmstxt.org standard.',
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        includeBlog: false,
        excludeImports: true,
        removeDuplicateHeadings: true,
        ignoreFiles: ['**/tags', '**/tags/**'],
        processingBatchSize: 50,
      }],
      envFlag("EXCLUDE_PLATFORM_API") ? null : ['docusaurus-plugin-llms', {
        id: 'llms-api',
        docsDir: 'platform-api-docs/docs',
        llmsTxtFilename: 'llms-api.txt',
        llmsFullTxtFilename: 'llms-api-full.txt',
        title: 'Seqera Platform API',
        description: 'API reference documentation for the Seqera Platform REST API.',
        rootContent: 'This file contains links to Seqera Platform API reference documentation following the llmstxt.org standard.',
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        includeBlog: false,
        excludeImports: true,
        removeDuplicateHeadings: true,
        ignoreFiles: ['**/tags', '**/tags/**'],
        processingBatchSize: 50,
      }],
      ['docusaurus-plugin-llms', {
        id: 'llms-cli',
        docsDir: 'platform-cli-docs/docs',
        llmsTxtFilename: 'llms-cli.txt',
        llmsFullTxtFilename: 'llms-cli-full.txt',
        title: 'Seqera Platform CLI',
        description: 'Documentation for the Seqera Platform command-line interface.',
        rootContent: 'This file contains links to Seqera Platform CLI documentation following the llmstxt.org standard.',
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        includeBlog: false,
        excludeImports: true,
        removeDuplicateHeadings: true,
        ignoreFiles: ['**/tags', '**/tags/**'],
        processingBatchSize: 50,
      }],
      ['docusaurus-plugin-llms', {
        id: 'llms-multiqc',
        docsDir: 'multiqc_docs/multiqc_repo/docs/markdown',
        llmsTxtFilename: 'llms-multiqc.txt',
        llmsFullTxtFilename: 'llms-multiqc-full.txt',
        title: 'MultiQC',
        description: 'Documentation for MultiQC',
        rootContent: 'This file contains links to MultiQC documentation following the llmstxt.org standard.',
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        includeBlog: false,
        excludeImports: true,
        removeDuplicateHeadings: true,
        ignoreFiles: ['**/tags', '**/tags/**'],
        processingBatchSize: 50,
      }],
      ['docusaurus-plugin-llms', {
        id: 'llms-fusion',
        docsDir: 'fusion_docs',
        llmsTxtFilename: 'llms-fusion.txt',
        llmsFullTxtFilename: 'llms-fusion-full.txt',
        title: 'Fusion',
        description: 'Documentation for Fusion.',
        rootContent: 'This file contains links to Fusion documentation following the llmstxt.org standard.',
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        includeBlog: false,
        excludeImports: true,
        removeDuplicateHeadings: true,
        ignoreFiles: ['**/tags', '**/tags/**'],
        processingBatchSize: 50,
      }],
      ['docusaurus-plugin-llms', {
        id: 'llms-wave',
        docsDir: 'wave_docs/wave_repo/docs',
        llmsTxtFilename: 'llms-wave.txt',
        llmsFullTxtFilename: 'llms-wave-full.txt',
        title: 'Wave',
        description: 'Documentation for Wave.',
        rootContent: 'This file contains links to Wave documentation following the llmstxt.org standard.',
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        includeBlog: false,
        excludeImports: true,
        removeDuplicateHeadings: true,
        ignoreFiles: ['**/tags', '**/tags/**'],
        processingBatchSize: 50,
      }],

      // Disable expensive bundler options: https://github.com/facebook/docusaurus/pull/11176
      function disableExpensiveBundlerOptimizationPlugin() {
        return {
          name: 'disable-expensive-bundler-optimizations',
          configureWebpack(_config) {
            return {
              optimization: {
                concatenateModules:  false,
              },
              resolve: {
                fallback: {
                  path: require.resolve('path-browserify'),
                },
              },
            };
          },
        };
      },

      // The OpenAPI theme bundles postman-code-generators (all 35 codegens) and
      // postman-collection into the CLIENT bundle for API Explorer snippets.
      // They require Node core modules that Rspack doesn't auto-polyfill, which
      // breaks the client build ("Can't resolve 'path'"). Polyfill path/url/
      // buffer for the browser; stub the rest.
      function openApiNodePolyfillsPlugin() {
        return {
          name: 'openapi-node-polyfills',
          configureWebpack() {
            return {
              resolve: {
                fallback: {
                  path: require.resolve('path-browserify'),
                  url: require.resolve('url/'),
                  buffer: require.resolve('buffer/'),
                  fs: false,
                  stream: false,
                  util: false,
                  querystring: false,
                  http: false,
                  https: false,
                  crypto: false,
                  os: false,
                  zlib: false,
                },
              },
            };
          },
        };
      },
    ].filter(Boolean),

    themeConfig: getSeqeraThemeConfig({
      seqera: {
        docs: {
          versionDropdown: {
            'platform-enterprise': {
              showCurrent: envFlag("INCLUDE_NEXT"),
            },
          },
        },
      },
      typesense: {
        typesenseCollectionName: 'seqera_docs',
        searchPagePath: '/search',
        typesenseServerConfig: {
          nodes: [
            {
              host: 'uk4gflrza0d8yx5sp-1.a1.typesense.net',
              port: 443,
              protocol: 'https',
            },
          ],
          apiKey: 'KZsuSjc7jPqDm7pkl1kN8TkoHH9b3dwY',
          connectionTimeoutSeconds: 2,
        },
        typesenseSearchParameters: {
          query_by: 'content,hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3',
          query_by_weights: '1,1,4,3,2',
          drop_tokens_threshold: 0,
          group_by: 'url',
          group_limit: 1,
          per_page: 20,
          num_typos: 2,
          prioritize_exact_match: true,
          filter_by: searchFilterBy, // Old platform-enterprise versions excluded automatically via searchFilterBy above
        },
        contextualSearch: false,
        placeholder: 'Search Seqera docs...',
        // Override default productRoutes to fix the Nextflow tag.
        // The default uses 'docs-default-current' but the Typesense index
        // has 'docs-nextflow-current'.
        productRoutes: [
          ['/platform-enterprise/', 'Platform Enterprise', 'platform-enterprise', null],
          ['/platform-cloud/', 'Platform Cloud', 'platform-cloud', null],
          ['/platform-cli/', 'Platform CLI', 'platform-cli', null],
          ['/platform-api/', 'Platform API', 'platform-api', null],
          ['/nextflow/', 'Nextflow', null, 'docs-nextflow-current'],
          ['/multiqc/', 'MultiQC', 'multiqc', null],
          ['/wave/', 'Wave', 'wave', null],
          ['/fusion/', 'Fusion', 'fusion', null],
          ['/changelog/', 'Changelog', null, null],
        ],
      },
      languageTabs: [
        {
          highlight: "python",
          language: "python",
          logoClass: "python",
        },
        {
          highlight: "bash",
          language: "curl",
          logoClass: "curl",
        },
        {
          highlight: "java",
          language: "java",
          logoClass: "java",
          variant: "unirest",
        },
        {
          highlight: "r",
          language: "r",
          logoClass: "r",
        },
        {
          highlight: "javascript",
          language: "javascript",
          logoClass: "javascript",
        },
        {
          highlight: "go",
          language: "go",
          logoClass: "go",
        },
        {
          highlight: "powershell",
          language: "powershell",
          logoClass: "powershell",
        },
      ],
      prism: {
        additionalLanguages: [
          "bash",
          "docker",
          "groovy",
          "ini",
          "java",
          "javascript",
          "json",
          "nextflow",
          "nginx",
          "python",
          "r",
          "shell-session",
          "sql",
          "typescript",
          "yaml",
        ],
      },
      navbar: {
        items: [
          {
            label: 'Cloud',
            href: '/platform-cloud/',
          },
          {
            label: 'Enterprise',
            href: '/platform-enterprise/',
          },
          {
            label: 'Nextflow',
            href: '/nextflow/',
          },
          {
            label: 'MultiQC',
            href: '/multiqc/',
          },
          {
            label: 'Wave',
            href: '/wave/',
          },
          {
            label: 'Fusion',
            href: '/fusion/',
          },
        ],
      },
    }),
  });
}
