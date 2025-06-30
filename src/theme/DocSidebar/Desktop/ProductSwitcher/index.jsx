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
    url: "/platform-cloud/platform-cloud",
  },
  {
    name: "Platform Enterprise",
    url: "/platform-enterprise/latest/platform-enterprise",
  },
  {
    name: "Nextflow",
    url: "nextflow/nextflow",
  },
  { name: "MultiQC", url: "/multiqc/" },
  { name: "Wave", url: "/wave/" },
  { name: "Fusion", url: "/fusion/" },
];

const ProductSwitcher = ({ isDropdown }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnterprisePage, setEnterprisePage] = useState(false);
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
    if (location.pathname.startsWith("/platform-enterprise"))
      return "Platform Enterprise";
    if (location.pathname.startsWith("/wave")) return "Wave";
    return null;
  };

  useEffect(() => {
    if (location.pathname.startsWith('/platform-enterprise')) {
      setEnterprisePage(true);
    } else {
      setEnterprisePage(false);
    }
  }, [location.pathname]);

  const currentProduct = getCurrentProduct();

  let items = products.filter((product) => product.name !== currentProduct);
  if (!isDropdown) items = products;

  return (
    <div className={clsx(`${styles.switcher} ${isEnterprisePage ? 'pt-2 px-4 mb-3' : 'hidden'}`)}>
      {isDropdown && (
        <div className={`${isEnterprisePage ? '' : 'hidden'}`}>
        <div
          className={clsx(styles.items, {
            [styles.active]: isOpen || isSecondaryOpen
          })}
        >
          {/* <button
            onClick={toggleDropdown}
            className={clsx(styles.item, styles.button)}
            ref={dropdownRef}
          >
            <ProductLogo />
          </button> */}
          <VersionSwitcher
            isOpen={isSecondaryOpen}
            setIsOpen={setIsSecondaryOpen}
          />
          </div>
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
