import React from 'react';
import { useLocation } from '@docusaurus/router';
import Home from '@theme-original/DocBreadcrumbs/Items/Home';

export default function HomeWrapper(props) {

  const location = useLocation();

  const getCurrentProduct = () => {
    if (location.pathname.startsWith("/fusion")) return "Fusion";
    if (location.pathname.startsWith("/nextflow")) return "Nextflow";
    if (location.pathname.startsWith("/multiqc")) return "MultiQC";
    if (location.pathname.startsWith("/platform-enterprise")) return "Platform Enterprise";
    if (location.pathname.startsWith("/platform-cloud")) return "Platform Cloud";
    if (location.pathname.startsWith("/wave")) return "Wave";
    return null;
  };

  const currentProduct = getCurrentProduct();

  return (
    <>
      <Home {...props} />
      <li className="breadcrumbs__item">
        <span className="breadcrumbs__link">
          {currentProduct}
        </span>
      </li>
    </>
  );
}
