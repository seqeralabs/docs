// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import math from 'remark-math';
import katex from 'rehype-katex';
import remarkYamlToTable from 'remark-yaml-to-table';
import remarkCodeImport from 'remark-code-import';
import tabBlocks from 'docusaurus-remark-plugin-tab-blocks';
import 'dotenv/config';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Seqera Docs",
  tagline: "Documentation for Seqera products",
  favicon: "img/favicon--dynamic.svg",

  // Set the production url of your site here
  url: "https://docs.seqera.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',
  trailingSlash: false,

  // GitHub pages deployment config.
  organizationName: "seqeralabs", 
  projectName: "docs",

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Add Algolia search configuration
  customFields: {
    algolia: {
      appId: process.env.PUBLIC_DOCUSAURUS_ALGOLIA_APP_ID,
      apiKey: process.env.PUBLIC_DOCUSAURUS_ALGOLIA_API_KEY,
      indexName: process.env.PUBLIC_DOCUSAURUS_ALGOLIA_INDEX_NAME,
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X',
      crossorigin: 'anonymous',
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // Add the blog/changelog section
        blog: {
          blogTitle: 'Seqera Changelog',
          blogDescription: 'Blog',
          blogSidebarCount: 5000,
          blogSidebarTitle: 'Changelog',
          path: 'changelog',
          routeBasePath: '/changelog',
          include: ['**/*.{md,mdx}'],
          showReadingTime: false,
          feedOptions: {
            type: 'all',
            title: 'Seqera Changelog',
            description: 'Stay updated with our blog posts!',
            copyright: `Copyright © ${new Date().getFullYear()} Seqera`,
          }
        },
        docs: false,
        theme: {
          customCss: [
             './src/css/main.css',
           //  './src/css/misc.css',
          //   './src/css/components/checklist.css',
             './src/css/components/box.css',
             './src/css/theme-colors.css',
             // './src/css/fonts/inter.css',
            // //'./src/css/fonts/degular.css',
          ],
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
    // Platform Cloud plugin
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'platform-cloud',
        path: "platform-cloud/docs",
        routeBasePath: 'platform-cloud',
        sidebarPath: './platform-cloud/cloud-sidebar.json',
        editUrl: 'https://github.com/seqeralabs/docs/tree/master/',
        remarkPlugins: [math, remarkYamlToTable, remarkCodeImport ,  tabBlocks],
        rehypePlugins: [katex],
      },
    ],
    // Wave plugin
    [
      '@docusaurus/plugin-content-docs',
      {
        id: "wave",
        routeBasePath: "/wave",
        path: "wave_docs/wave_repo/docs",
        sidebarPath: './wave_docs/sidebar.json',
        remarkPlugins: [math, remarkYamlToTable, remarkCodeImport ,  tabBlocks],
        rehypePlugins: [katex],
        editUrl: ({ docPath }) => {
          return `https://github.com/seqeralabs/wave/blob/master/docs/${docPath.replace('wave', '')}`
        },
      },
    ],
    // MultiQC plugin
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'multiqc',
        path: "multiqc_docs/multiqc_repo/docs/markdown",
        routeBasePath: 'multiqc',
        sidebarPath: './multiqc_docs/sidebar.js',
        remarkPlugins: [math, remarkYamlToTable, remarkCodeImport ,  tabBlocks],
        rehypePlugins: [katex],
        editUrl: ({ docPath }) => {
          return `https://github.com/MultiQC/MultiQC/blob/main/docs/markdown/${docPath.replace('multiqc', '')}`
        },
      },
    ],
    // Fusion plugin
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'fusion',
        path: 'fusion_docs',
        routeBasePath: 'fusion',
        sidebarPath: './fusion_docs/sidebar.json',
        remarkPlugins: [math, remarkYamlToTable, remarkCodeImport ,  tabBlocks],
        rehypePlugins: [katex],
        editUrl: 'https://github.com/seqeralabs/docs/tree/master/',
      },
    ],
    // Platform Enterprise plugin
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'platform-enterprise',
        path: 'platform-enterprise',
        routeBasePath: 'platform-enterprise',
        sidebarPath: './platform-enterprise/sidebar.json',
        includeCurrentVersion: false,
        remarkPlugins: [ math, remarkYamlToTable], //remarkCodeImport tabBlocks
        rehypePlugins: [katex],
        editUrl: 'https://github.com/seqeralabs/docs/tree/master/',
      },
    ],
    //Tailwind CSS plugin
    function tailwind() {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
    //Latest routing plugin
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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/share.jpg",
      navbar: {
        title: '',
        logo: {
          alt: "Seqera",
          src: "img/logo2.png",
          srcDark: "img/logo2-dark.png",
        },
        items: [
          {
            to: "/platform-enterprise/",
            position: "left",
            label: "Platform Enterprise",
          },
          {
            to: "/platform-cloud/",
            position: "left",
            label: "Platform Cloud",
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
            docsPluginId: "platform-enterprise",
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
                label: "Platform Enterprise",
                to: "/platform-enterprise/",
              },
              {
                label: "Platform Cloud",
                to: "/platform-cloud/",
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
        copyright: `© ${new Date().getFullYear()} Seqera`,
      },
      prism: {
        theme: prismThemes.oneLight,
        darkTheme: prismThemes.oneDark,
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
    }),
  
  //Add client-side modules
  clientModules: [require.resolve("./clientside-scripts.js")],
};

export default config;
