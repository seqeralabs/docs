import { themes } from "prism-react-renderer";
const path = require("path");
import 'dotenv/config';

import platform_enterprise_latest_version from "./platform-enterprise_latest_version.js";

export default async function createConfigAsync() {
  return {
    title: "Seqera Docs",
    tagline: "Documentation for Seqera products",
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

    customFields: {
      // Put your custom environment here
      algolia: {
        appId: process.env.PUBLIC_DOCUSAURUS_ALGOLIA_APP_ID,
        apiKey: process.env.PUBLIC_DOCUSAURUS_ALGOLIA_API_KEY,
        indexName: process.env.PUBLIC_DOCUSAURUS_ALGOLIA_INDEX_NAME,
      },
    },

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
      defaultLocale: "en",
      locales: ["en"],
    },
    themes: ['docusaurus-theme-openapi-docs'],
    presets: [
      [
        "classic",
        {
          docs: false,
          theme: {
            customCss: [
              require.resolve("./src/css/main.css"),
              require.resolve("./src/css/typography.css"),
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
          id: "platform-enterprise",
          routeBasePath: "/platform-enterprise",
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
            // Replace /platform-enterprise with /platform-enterprise/24.2, when no version is specified in the URL.
            // (Applies to latest version only)
            [platform_enterprise_latest_version]: {
              label: platform_enterprise_latest_version,
              path: platform_enterprise_latest_version,
            },
          },
        },
      ],
      [
        "@docusaurus/plugin-content-docs",
        {
          id: "platform-api",
          routeBasePath: "/platform-api",
          path: "platform-api-docs/docs",
          remarkPlugins: [
            (await require("remark-yaml-to-table")).default,
          ],
          sidebarPath: "platform-api-docs/docs/sidebar.js",
          docItemComponent: '@theme/ApiItem'
        },
      ],      
      [
        "docusaurus-plugin-openapi-docs",
        {
          id: "api", // plugin id
          docsPluginId: "classic", // configured for preset-classic
          config: {
            platform: {
              specPath: "platform-api-docs/seqera-api-latest.yml",
              outputDir: "platform-api-docs/docs",
              sidebarOptions: {
                groupPathsBy: "tag",
              },
            }
          },
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
                path: "/platform-enterprise/latest",
                exact: false,
                component: "@site/src/pages/platform-enterprise/latest.tsx",
              },
            ].map((route) => actions.addRoute(route));
          },
        };
      },
    ],

    themeConfig: {
      image: "img/share.jpg",
      navbar: {
        logo: {
          alt: "Seqera",
          src: "img/Logo.svg",
          srcDark: "img/LogoWhite.svg",
          width: "180px",
          className: 'w-[100px]'
        },
        items: [
          {
            type: 'html',
            position: 'left',
            value: '<a href="https://docs.seqera.io/platform-cloud/" class="menu__link">Platform Cloud</a>'
          },
          {
            type: 'html',
            position: 'left',
            value: '<a href="https://docs.seqera.io/platform-enterprise" class="menu__link">Platform Enterprise</a>'
          },
          // {
          //   type: "docsVersionDropdown",
          //   position: "right",
          //   docsPluginId: "platform-enterprise",
          // },
          {
            to: "https://www.nextflow.io/docs/latest/",
            html: 'Nextflow <svg width="12" height="12" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_nPIU" style="margin-left:6px;opacity:0.6;"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>',
            position: "left",
            target: "_blank",
          },
          {
            type: 'html',
            position: 'left',
            value: '<a href="https://docs.seqera.io/multiqc/" class="menu__link">MultiQC</a>'
          },
          {
            type: 'html',
            position: 'left',
            value: '<a href="https://docs.seqera.io/wave/" class="menu__link">Wave</a>'
          },
          {
            type: 'html',
            position: 'left',
            value: '<a href="https://docs.seqera.io/fusion/" class="menu__link">Fusion</a>'
          },
          {
            to: "https://training.nextflow.io/latest/",
            html: 'Nextflow Training <svg width="12" height="12" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_nPIU" style="margin-left:6px;opacity:0.6;"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>',
            position: "left",
            target: "_blank",
          },
          {
            to: "/platform-api/seqera-api",
            label: "Platform API",
            position: "left",
          },
        ],
      },
      footer: {
        style: "dark",
        logo: {
          alt: 'Seqera Docs logo',
          src: 'img/icon.svg', 
          srcDark: "img/iconLight.svg",
          href: '/', 
          width: 25,  
          height: 25, 
        },
        links: [
        ],
        copyright: `© ${new Date().getFullYear()} Seqera`,
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