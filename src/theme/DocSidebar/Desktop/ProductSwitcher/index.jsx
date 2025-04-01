import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";

import ProductLogo from "./ProductLogo";
import LinkOut from "./LinkOut.inline.svg";

import styles from "./styles.module.css";
import VersionSwitcher from "./VersionSwitcher";

const products = [
  {
    name: "Platform Cloud",
    url: "/platform-cloud/",
  },
  {
    name: "Platform Enterprise",
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
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      const ref = dropdownRef.current;
      if (!ref?.contains(event.target)) {
        setTimeout(() => setIsOpen(false), 100);
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
    if (location.pathname.startsWith("/platform-cloud"))
      return "Platform Cloud";
    if (location.pathname.startsWith("/platform")) return "Platform Enterprise";
    if (location.pathname.startsWith("/wave")) return "Wave";
    return null;
  };

  const currentProduct = getCurrentProduct();

  let items = products.filter((product) => product.name !== currentProduct);
  if (!isDropdown) items = products;

  return (
    <div className={clsx(styles.switcher)}>
      {isDropdown && (
        <div
          className={clsx(styles.items, {
            [styles.active]: isOpen || isSecondaryOpen,
          })}
        >
          <button
            onClick={toggleDropdown}
            className={clsx(styles.item, styles.button)}
            ref={dropdownRef}
          >
            <ProductLogo />
          </button>
          <VersionSwitcher
            isOpen={isSecondaryOpen}
            setIsOpen={setIsSecondaryOpen}
          />
        </div>
      )}
      <div
        className={clsx(styles.items, {
          [styles.dropdown]: isDropdown,
          [styles.open]: isOpen,
        })}
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
            {product.name === "Nextflow" && <LinkOut />}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductSwitcher;
