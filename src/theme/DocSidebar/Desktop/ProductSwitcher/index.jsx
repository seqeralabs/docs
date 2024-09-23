import React, { useState, useRef, useEffect } from "react";
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';

import styles from "./styles.module.css";
import ProductLogo from "./ProductLogo";
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
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const products = [
  { name: "Platform", logo: Platform, logoDark: PlatformDark, url: "/platform/" },
  { name: "Nextflow", logo: Nextflow, logoDark: NextflowDark, url: "https://www.nextflow.io/docs/latest/" },
  { name: "MultiQC", logo: MultiQC, logoDark: MultiQCDark, url: "/multiqc/" },
  { name: "Wave", logo: Wave, logoDark: WaveDark, url: "/wave/" },
  { name: "Fusion", logo: Fusion, logoDark: FusionDark, url: "/fusion/" },
];

const ProductSwitcher = () => {
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

  return (
    <div className={styles.productSwitcherWrapper}>
      <button
        onClick={toggleDropdown}
        className={`${styles.productSwitcherButton} ${isOpen ? styles.productSwitcherButtonOpen : ''}`}
        ref={dropdownRef}
      >
        <ProductLogo />
        <Caret className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`} />
      </button>
      <div className={`${styles.dropdown} ${isOpen ? styles.dropdownVisible : ''}`}>
        {products
          .filter((product) => product.name !== currentProduct)
          .map((product) => (
            <Link
              key={product.name}
              to={product.url}
              className={styles.dropdownItem}
              target={product.name === "Nextflow" ? "_blank" : undefined}
              rel={product.name === "Nextflow" ? "noopener noreferrer" : undefined}
            >
              <div className={styles.dropdownItemContent}>
                <product.logo className={styles.productLogo + " " + styles.themeLight} />
                <product.logoDark className={styles.productLogo + " " + styles.themeDark} />
              </div>
              {product.name === "Nextflow" && <ExternalLinkIcon className={styles.externalLinkIcon} />}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ProductSwitcher;
