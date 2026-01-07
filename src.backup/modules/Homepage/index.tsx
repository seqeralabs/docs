import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Seqera Docs"
      description="Documentation for Seqera products"
    >
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Seqera Documentation</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Comprehensive guides and documentation for all Seqera products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Link
            to="/platform-cloud"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow no-underline"
          >
            <h2 className="text-2xl font-bold mb-2 text-primary">Platform Cloud</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get started with Seqera Platform Cloud
            </p>
          </Link>

          <Link
            to="/platform-enterprise"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow no-underline"
          >
            <h2 className="text-2xl font-bold mb-2 text-primary">Platform Enterprise</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Documentation for Platform Enterprise deployments
            </p>
          </Link>

          <Link
            to="/platform-api"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow no-underline"
          >
            <h2 className="text-2xl font-bold mb-2 text-primary">Platform API</h2>
            <p className="text-gray-600 dark:text-gray-400">
              API reference and integration guides
            </p>
          </Link>

          <Link
            to="/multiqc"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow no-underline"
          >
            <h2 className="text-2xl font-bold mb-2 text-primary">MultiQC</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Aggregate and visualize bioinformatics results
            </p>
          </Link>

          <Link
            to="/wave"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow no-underline"
          >
            <h2 className="text-2xl font-bold mb-2 text-primary">Wave</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Container provisioning and management
            </p>
          </Link>

          <Link
            to="/fusion"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow no-underline"
          >
            <h2 className="text-2xl font-bold mb-2 text-primary">Fusion</h2>
            <p className="text-gray-600 dark:text-gray-400">
              High-performance distributed file system
            </p>
          </Link>
        </div>

        <div className="text-center mt-16">
          <Link
            to="https://www.nextflow.io/docs/latest/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity no-underline"
          >
            Nextflow Documentation
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </main>
    </Layout>
  );
}
