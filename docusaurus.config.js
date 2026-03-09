import "dotenv/config";
import {
  createSeqeraConfig,
  getSeqeraThemeConfig,
  getSeqeraPresetOptions
} from "@seqera/docusaurus-preset-seqera";

export default async function createConfigAsync() {
  const DOCS_SITE_MODE = process.env.DOCS_SITE_MODE ?? "main";
  const MAIN_SITE_MODE = "main";
  const ENTERPRISE_ARCHIVE_SITE_MODE = "enterprise-archive";
  const isEnterpriseArchiveSite =
    DOCS_SITE_MODE === ENTERPRISE_ARCHIVE_SITE_MODE;

  const enterpriseVersionsBySiteMode = {
    [MAIN_SITE_MODE]: ["25.3", "25.2", "25.1", "24.2", "24.1"],
    [ENTERPRISE_ARCHIVE_SITE_MODE]: ["23.4", "23.3", "23.2", "23.1"],
  };
  const activeEnterpriseVersions =
    enterpriseVersionsBySiteMode[DOCS_SITE_MODE] ??
    enterpriseVersionsBySiteMode[MAIN_SITE_MODE];
  const activeEnterpriseLastVersion = activeEnterpriseVersions[0];
  const docsSiteUrl = isEnterpriseArchiveSite
    ? "https://docs-archive.seqera.io"
    : "https://docs.seqera.io";
  const supportedEnterpriseDocsUrl =
    "https://docs.seqera.io/platform-enterprise/";
  const legacyEnterpriseArchiveUrl =
    "https://docs-archive.seqera.io/platform-enterprise/";

  const mainNavbarItems = [
    {
      label: "Cloud",
      href: "/platform-cloud/",
    },
    {
      label: "Enterprise",
      href: "/platform-enterprise/",
    },
    {
      label: "Nextflow",
      href: "/nextflow/",
    },
    {
      label: "MultiQC",
      href: "/multiqc/",
    },
    {
      label: "Wave",
      href: "/wave/",
    },
    {
      label: "Fusion",
      href: "/fusion/",
    },
  ];

  const archiveNavbarItems = [
    {
      label: "Enterprise",
      href: "/platform-enterprise/",
    },
    {
      label: "Supported versions",
      href: supportedEnterpriseDocsUrl,
    },
  ];

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
      includeCurrentVersion:
        !isEnterpriseArchiveSite && process.env.INCLUDE_NEXT ? true : false,
      lastVersion: activeEnterpriseLastVersion,
      onlyIncludeVersions: activeEnterpriseVersions,
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
    "\n  DOCS_SITE_MODE: " + DOCS_SITE_MODE,
    "\n  EXCLUDE_CHANGELOG: " + (process.env.EXCLUDE_CHANGELOG ? true : false),
    "\n  EXCLUDE_PLATFORM_ENTERPRISE: " +
      (process.env.EXCLUDE_PLATFORM_ENTERPRISE ? true : false),
    "\n  EXCLUDE_PLATFORM_CLOUD: " +
      (process.env.EXCLUDE_PLATFORM_CLOUD ? true : false),
    "\n  EXCLUDE_PLATFORM_API: " +
      (process.env.EXCLUDE_PLATFORM_API ? true : false),
    "\n  EXCLUDE_PLATFORM_CLI: " +
      (process.env.EXCLUDE_PLATFORM_CLI ? true : false),
    "\n  EXCLUDE_PLATFORM_OPENAPI: " +
      (process.env.EXCLUDE_PLATFORM_OPENAPI ? true : false),
    "\n  EXCLUDE_MULTIQC: " + (process.env.EXCLUDE_MULTIQC ? true : false),
    "\n  EXCLUDE_FUSION: " + (process.env.EXCLUDE_FUSION ? true : false),
    "\n  EXCLUDE_WAVE: " + (process.env.EXCLUDE_WAVE ? true : false),
    "\n  INCLUDE_NEXT: " + (process.env.INCLUDE_NEXT ? true : false),
    "\n  ACTIVE_PLATFORM_ENTERPRISE_VERSIONS: " +
      activeEnterpriseVersions.join(", "),
  );

  return createSeqeraConfig({
    title: isEnterpriseArchiveSite ? "Seqera Docs Archive" : "Seqera Docs",
    tagline: isEnterpriseArchiveSite
      ? "Archived documentation for Seqera Platform Enterprise"
      : "Documentation for Seqera products",
    url: docsSiteUrl,
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
      },
    },

    // If you aren't using GitHub pages, you don't need these.
    organizationName: "seqeralabs", // Usually your GitHub org/user name.
    projectName: "docs", // Usually your repo name.

    onBrokenLinks:
      process.env.FAIL_ON_BROKEN_LINKS === "true" ? "throw" : "warn",
    onBrokenAnchors:
      process.env.FAIL_ON_BROKEN_LINKS === "true" ? "throw" : "warn",

    markdown: {
      hooks: {
        onBrokenMarkdownLinks:
          process.env.FAIL_ON_BROKEN_LINKS === "true" ? "throw" : "warn",
      },
    },

    customFields: {
      docsSiteMode: DOCS_SITE_MODE,
      activeEnterpriseVersions,
      supportedEnterpriseDocsUrl,
      legacyEnterpriseArchiveUrl,
    },

    clientModules: [
      require.resolve("./src/client-modules/cross-site-nav.js"),
      ...(isEnterpriseArchiveSite
        ? []
        : [require.resolve("./src/client-modules/posthog-search.js")]),
    ],


    presets: [
      [
        "@seqera/docusaurus-preset-seqera",
        await getSeqeraPresetOptions({
          blog:
            isEnterpriseArchiveSite || process.env.EXCLUDE_CHANGELOG
              ? false
              : changelog,
          docs: false,
          theme: {
            customCss: require.resolve("./src/custom.css"),
          },
          openapi:
            isEnterpriseArchiveSite || process.env.EXCLUDE_PLATFORM_OPENAPI
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
      docs_platform_enterprise,
      isEnterpriseArchiveSite || process.env.EXCLUDE_PLATFORM_CLOUD
        ? null
        : docs_platform_cloud,
      isEnterpriseArchiveSite || process.env.EXCLUDE_PLATFORM_API
        ? null
        : docs_platform_api,
      isEnterpriseArchiveSite || process.env.EXCLUDE_PLATFORM_CLI
        ? null
        : docs_platform_cli,
      isEnterpriseArchiveSite || process.env.EXCLUDE_MULTIQC
        ? null
        : docs_multiqc,
      isEnterpriseArchiveSite || process.env.EXCLUDE_FUSION
        ? null
        : docs_fusion,
      isEnterpriseArchiveSite || process.env.EXCLUDE_WAVE ? null : docs_wave,

      // Disable expensive bundler options.
      // https://github.com/facebook/docusaurus/pull/11176
      function disableExpensiveBundlerOptimizationPlugin() {
        return {
          name: 'disable-expensive-bundler-optimizations',
          configureWebpack(_config) {
            return {
              optimization: {
                concatenateModules:  false,
              },
            };
          },
        };
      },
    ],

    themeConfig: getSeqeraThemeConfig({
      announcementBar: isEnterpriseArchiveSite
        ? {
            id: "enterprise-archive-notice",
            content: `Legacy Seqera Platform Enterprise documentation. For supported releases, visit <a href="${supportedEnterpriseDocsUrl}">docs.seqera.io/platform-enterprise/</a>.`,
            backgroundColor: "#f3f4f6",
            textColor: "#111827",
            isCloseable: false,
          }
        : undefined,
      typesense: {
        typesenseCollectionName: "seqera_docs",
        searchPagePath: isEnterpriseArchiveSite ? false : "/search",
        typesenseServerConfig: {
          nodes: [
            {
              host: "uk4gflrza0d8yx5sp-1.a1.typesense.net",
              port: 443,
              protocol: "https",
            },
          ],
          apiKey: "KZsuSjc7jPqDm7pkl1kN8TkoHH9b3dwY",
          connectionTimeoutSeconds: 2,
        },
        typesenseSearchParameters: {
          query_by:
            "content,hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3",
          group_by: "url_without_anchor",
          group_limit: 1,
          num_typos: 1,
          prioritize_exact_match: true,
          filter_by:
            "docusaurus_tag:!=[default,doc_tag_doc_list,blog_posts_list,blog_tags_posts,doc_tags_list,blog_tags_list]", // TODO Remove once the scraper is updated
        },
        contextualSearch: false,
        placeholder: "Search Seqera docs...",
      },
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
        items: isEnterpriseArchiveSite ? archiveNavbarItems : mainNavbarItems,
      },
      seqera: {
        docs: {
          versionDropdown: {
            "platform-enterprise": {
              enabled: true,
            },
          },
        },
      },
    }),
  });
}
