import { themes } from "prism-react-renderer";
const path = require("path");

import platform_latest_version from "./platform_latest_version.js";

export default async function createConfigAsync() {
  return {
    title: "Seqera Docs",
    tagline: "Documentation for Seqera Labs products",
    favicon: "img/favicon--dynamic.svg",

    // Set the production url of your site here
    url: "https://docs.seqera.io",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",
    trailingSlash: false,

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "seqeralabs", // Usually your GitHub org/user name.
    projectName: "docs", // Usually your repo name.

    onBrokenLinks: "warn",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
      defaultLocale: "en",
      locales: ["en"],
    },

    future: {
      experimental_faster: true,
    },

    presets: [
      [
        "classic",
        {
          blog: {
            blogTitle: 'Seqera Changelog',
            blogDescription: 'Blog',
            blogSidebarCount: 5000,
            blogSidebarTitle: 'Changelog',
            path: 'changelog',
            routeBasePath: '/changelog',
            //processBlogPosts: () => ({}),
            include: ['**/*.{md,mdx}'],
            showReadingTime: false,
            feedOptions: {
            type: 'all', // 'rss', 'atom', or both
            title: 'Seqera Changelog',
            description: 'Stay updated with our blog posts!',
            copyright: `Copyright © ${new Date().getFullYear()} Seqera`,
            }
          },
          docs: false,
          theme: {
            customCss: [
              require.resolve("./src/css/main.css"),
              require.resolve("./src/css/misc.css"),
              require.resolve("./src/css/components/checklist.css"),
              require.resolve("./src/css/components/box.css"),
              require.resolve("./src/css/theme-colors.css"),
              require.resolve("./src/css/fonts/inter.css"),
              require.resolve("./src/css/fonts/degular.css"),
            ],
          },
          gtag: {
            trackingID: "G-NR1CNM213G",
            anonymizeIP: true,
          },
          googleTagManager: {
            containerId: "GTM-MBCJKK4",
          },
        },
      ],
    ],
    plugins: [
      [
        "@docusaurus/plugin-content-docs",
        {
          id: "platform",
          routeBasePath: "/platform",
          includeCurrentVersion: false,
          remarkPlugins: [
            (await import("remark-code-import")).default,
            (await require("remark-math")).default,
            (await import("docusaurus-remark-plugin-tab-blocks")).default,
            (await require("remark-yaml-to-table")).default,
          ],
          rehypePlugins: [(await require("rehype-katex")).default],
          editUrl: "https://github.com/seqeralabs/docs/tree/master/",
          sidebarPath: false,
          versions: {
            // Force path to be /platform/24.1 instead of /platform
            // (Applies to latest version only)
            [platform_latest_version]: {
              label: platform_latest_version,
              path: platform_latest_version,
            },
          },
        },
      ],
      [
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
          rehypePlugins: [(await require("rehype-katex")).default],
          editUrl: ({ docPath }) => {
            return `https://github.com/MultiQC/MultiQC/blob/main/docs/markdown/${docPath.replace('multiqc_docs/multiqc_repo/docs', '')}`
          },
          sidebarPath: "./multiqc_docs/sidebar.js",
        },
      ],      [
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
          rehypePlugins: [(await require("rehype-katex")).default],
          editUrl: "https://github.com/seqeralabs/docs/tree/master/",
          sidebarPath: "./fusion_docs/sidebar.json",
        },
      ],
      [
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
          ],
          rehypePlugins: [(await require("rehype-katex")).default],
          editUrl: ({ docPath }) => {
            return `https://github.com/seqeralabs/wave/blob/master/docs/${docPath.replace('wave_docs/wave_repo/docs', '')}`
          },
          sidebarPath: "./wave_docs/sidebar.json",
        },
      ],
      async function tailwind() {
        return {
          name: "docusaurus-tailwindcss",
          configurePostCss(postcssOptions) {
            postcssOptions.plugins.push(require("tailwindcss"));
            postcssOptions.plugins.push(require("autoprefixer"));
            return postcssOptions;
          },
        };
      },
      function routing() {
        return {
          name: "latest-routing",
          async contentLoaded({ actions }) {
            [
              {
                path: "/platform/latest",
                exact: false,
                component: "@site/src/pages/platform/latest.tsx",
              },
            ].map((route) => actions.addRoute(route));
          },
        };
      },
      path.resolve(__dirname, "plugins_custom/seqera_jobs"),
      path.resolve(__dirname, "plugins_custom/seqera_events"),
    ],

    themeConfig: {
      image: "img/share.jpg",
      navbar: {
        logo: {
          alt: "Seqera",
          src: "img/logo2.png",
          srcDark: "img/logo2-dark.png",
        },
        items: [
          {
            to: "/platform/",
            position: "left",
            label: "Platform",
          },
          {
            to: "https://www.nextflow.io/docs/latest/",
            html: 'Nextflow <svg width="12" height="12" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_nPIU" style="margin-left:4px;opacity:0.6;"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>',
            position: "left",
            target: "_blank",
          },
          {
            to: "/multiqc/",
            label: "MultiQC",
            position: "left",
          },
          {
            to: "/wave/",
            label: "Wave",
            position: "left",
          },
          {
            to: "/fusion/",
            label: "Fusion",
            position: "left",
          },
          {
            type: "search",
            position: "right",
          },
          {
            type: "docsVersionDropdown",
            position: "right",
            docsPluginId: "platform",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Platform",
                to: "/platform/",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Github",
                href: "https://github.com/seqeralabs",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/14065390/",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/seqeralabs",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "About Seqera",
                href: "https://seqera.io/",
              },
            ],
          },
        ],
        copyright: `${new Date().getFullYear()} © Seqera`,
      },
      prism: {
        theme: themes.oneLight,
        darkTheme: themes.oneDark,
        additionalLanguages: [
          "bash",
          "docker",
          "groovy",
          "ini",
          "java",
          "json",
          "nginx",
          "python",
          "r",
          "shell-session",
          "sql",
          "typescript",
          "yaml"
        ],
      },
      algolia: {
        appId: "Z0I1G1OVKB",
        apiKey: "17446a4f6a2477f0a22e1a78da88e4d5", // search-only (safe/public)
        indexName: "seqera",
        contextualSearch: false,
      },
    },
    clientModules: [require.resolve("./clientside-scripts.js")],
    stylesheets: [
      {
        href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css",
        type: "text/css",
        integrity:
          "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X",
        crossorigin: "anonymous",
      },
    ],
  };
}
