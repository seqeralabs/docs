const path = require("path");
import "dotenv/config";
import platform_enterprise_latest_version from "./platform-enterprise_latest_version.js";
import {
  createSeqeraConfig,
  getSeqeraThemeConfig,
  getSeqeraPresetOptions
} from "@seqera/docusaurus-preset-seqera";

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
      includeCurrentVersion: process.env.INCLUDE_NEXT ? true : false,
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
      // Put your custom environment here
    },

    presets: [
      [
        "@seqera/docusaurus-preset-seqera",
        await getSeqeraPresetOptions({
          blog: process.env.EXCLUDE_CHANGELOG ? false : changelog,
          docs: false,
          theme: {
            customCss: require.resolve("./src/custom.css"),
          },
          openapi: process.env.EXCLUDE_PLATFORM_OPENAPI
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
      process.env.EXCLUDE_PLATFORM_ENTERPRISE ? null : docs_platform_enterprise,
      process.env.EXCLUDE_PLATFORM_CLOUD ? null : docs_platform_cloud,
      process.env.EXCLUDE_PLATFORM_API ? null : docs_platform_api,
      process.env.EXCLUDE_PLATFORM_CLI ? null : docs_platform_cli,
      process.env.EXCLUDE_MULTIQC ? null : docs_multiqc,
      process.env.EXCLUDE_FUSION ? null : docs_fusion,
      process.env.EXCLUDE_WAVE ? null : docs_wave,

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
      prism: {
        additionalLanguages: ['nextflow', 'groovy', 'java', 'bash', 'yaml', 'json'],
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
            href: '/nextflow/',  // Changed from 'to' to 'href' for external proxy
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
