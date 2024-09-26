import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";

import ProductLogo from "./ProductLogo";

import styles from "./styles.module.css";
import Caret from "./images/caret.svg";

import MultiQC from "./images/multiqc.svg";
import Nextflow from "./images/nextflow.svg";
import Wave from "./images/wave.svg";
import Fusion from "./images/fusion.svg";
import Platform from "./images/platform.svg";

import MultiQCDark from "./images/multiqc.dark.svg";
import NextflowDark from "./images/nextflow.dark.svg";
import WaveDark from "./images/wave.dark.svg";
import FusionDark from "./images/fusion.dark.svg";
import PlatformDark from "./images/platform.dark.svg";

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const products = [
  {
    name: "Platform",
    url: "/platform/",
  },
  {
    name: "Nextflow",
    url: "https://www.nextflow.io/docs/latest/",
  },
  { name: "MultiQC", url: "/multiqc/" },
  { name: "Wave", url: "/wave/" },
  { name: "Fusion", url: "/fusion/" },
];

const ProductSwitcher = ({ isDropdown }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const getCurrentProduct = () => {
    if (location.pathname.startsWith("/fusion")) return "Fusion";
    if (location.pathname.startsWith("/nextflow")) return "Nextflow";
    if (location.pathname.startsWith("/multiqc")) return "MultiQC";
    if (location.pathname.startsWith("/platform")) return "Platform";
    if (location.pathname.startsWith("/wave")) return "Wave";
    return null;
  };

  const currentProduct = getCurrentProduct();

  let items = products.filter((product) => product.name !== currentProduct);
  if (!isDropdown) items = products;

  return (
    <div className={clsx(styles.switcher, { [styles.open]: isOpen })}>
      {isDropdown && (
        <button
          onClick={toggleDropdown}
          className={styles.button}
          ref={dropdownRef}
        >
          <ProductLogo />
          <Caret className={styles.caret} />
        </button>
      )}
      <div
        className={clsx(styles.items, isDropdown ? styles.dropdown : undefined)}
      >
        {items.map((product) => (
          <Link
            key={product.name}
            to={product.url}
            className={styles.item}
            target={product.name === "Nextflow" ? "_blank" : undefined}
            rel={
              product.name === "Nextflow" ? "noopener noreferrer" : undefined
            }
          >
            <ProductLogo product={product.name} />
            {product.name === "Nextflow" && (
              <ExternalLinkIcon className={styles.externalLinkIcon} />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductSwitcher;
