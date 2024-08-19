import React from "react";
import styles from "./styles.module.css";
import ProductLogo from "./ProductLogo";

import Caret from "./images/caret.svg";


const ProductSwitcher = () => {
  return (
    <div className={styles.productSwitcherWrapper}>
      <ProductLogo />
      <Caret className={styles.caret} />
    </div>
  )
}

export default ProductSwitcher;
