import React from "react";
import Link from "../../_shared/Link";
import { motion, AnimatePresence } from "framer-motion";

import Products from "./Products";
import Community from "./Community";
import Company from "./Company";
import Resources from "./Resources";
import AngleRight from "../../_shared/angle-right.inline.svg";

import styles from "./styles.module.css";
import { useHeaderContext } from "../../context";

const navVariants = {
  enter: { y: -20, opacity: 0 },
  idle: { y: 0, opacity: 1 },
  exit: { opacity: 0, y: -20 },
};

const transition = {
  ease: "easeOut",
  duration: 0.2,
};

const Submenu = () => {
  const { activeMenu, isMenuOpen } = useHeaderContext();
  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial="enter"
          animate="idle"
          exit="exit"
          variants={navVariants}
          transition={transition}
        >
          <div className="container-lg px-4 pt-8 ">
            <div className="relative min-h-[318px]">
              <Products isOpen={activeMenu === "products"} />
              <Resources isOpen={activeMenu === "resources"} />
              <Community isOpen={activeMenu === "community"} />
              <Company isOpen={activeMenu === "company"} />
            </div>
            <Link className={styles.learnMore} to="/about">
              Learn more about Seqera and our mission
              <AngleRight className="inline-block ml-2" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Submenu;
