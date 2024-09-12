import React, { useState, useRef, useEffect } from "react";
import { useLocation } from '@docusaurus/router';

import styles from "./styles.module.css";
import ProductLogo from "./ProductLogo";
import Caret from "./images/caret.svg";

import MultiQC from "./images/multiqc.inline.svg";
import Nextflow from "./images/nextflow.inline.svg";
import Wave from "./images/wave.inline.svg";
import Fusion from "./images/fusion.inline.svg";
import Platform from "./images/platform2.inline.svg";

import MultiQCDark from "./images/multiqc.dark.inline.svg";
import NextflowDark from "./images/nextflow.dark.inline.svg";
import WaveDark from "./images/wave.dark.inline.svg";
import FusionDark from "./images/fusion.dark.inline.svg";
import PlatformDark from "./images/platform2.dark.inline.svg";

const products = [
  { name: "MultiQC", logo: MultiQC, logoDark: MultiQCDark, url: "/multiqc/" },
  { name: "Nextflow", logo: Nextflow, logoDark: NextflowDark, url: "https://www.nextflow.io/docs/latest/" },
  { name: "Wave", logo: Wave, logoDark: WaveDark, url: "/wave/" },
  { name: "Fusion", logo: Fusion, logoDark: FusionDark, url: "/fusion/" },
  { name: "Platform", logo: Platform, logoDark: PlatformDark, url: "/platform/" },
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
    <button
      onClick={toggleDropdown}
      className={`${styles.productSwitcherWrapper} ${isOpen ? styles.productSwitcherWrapperOpen : ''}`}
      ref={dropdownRef}
    >
      <ProductLogo />
      <Caret className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`} />
      <div className={`${styles.dropdown} ${isOpen ? styles.dropdownVisible : ''}`}>
        {products
          .filter((product) => product.name !== currentProduct)
          .map((product) => (
            <a
              key={product.name}
              href={product.url}
              className={styles.dropdownItem}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              <product.logo className={styles.productLogo + " " + styles.themeLight} />
              <product.logoDark className={styles.productLogo + " " + styles.themeDark} />
            </a>
          ))}
      </div>
    </button>
  );
};

export default ProductSwitcher;
