import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import Products from "./Category/Products";
import Resources from "./Category/Resources";
import Community from "./Category/Community";
import Company from "./Category/Company";
import Category from "./Category";

import styles from "./styles.module.css";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("Products");

  const navVariants = {
    enter: { y: -20, opacity: 0 },
    enter2: { y: 60, opacity: 0 },
    idle: { y: 0, opacity: 1 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, delay: 0 } },
    exit2: { opacity: 0, y: 20, transition: { duration: 0.2, delay: 0 } },
  };

  const transition = {
    ease: "easeOut",
    duration: 0.2,
    delay: 0.2,
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial="enter"
          animate="idle"
          exit="exit"
          variants={navVariants}
          transition={transition}
          className={styles.categories}
        >
          <Category
            label="Products"
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          >
            <Products />
          </Category>
          <Category
            label="Resources"
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          >
            <Resources />
          </Category>
          <Category
            label="Community"
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          >
            <Community />
          </Category>
          <Category
            label="Company"
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          >
            <Company />
          </Category>
        </motion.div>
      </AnimatePresence>
      {/* <AnimatePresence>
        <motion.div
          className={styles.footer}
          initial="enter2"
          animate="idle"
          exit="exit2"
          variants={navVariants}
          transition={transition}
        >
          <div className={styles.ctas}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://tower.nf/login"
              className={clsx(styles.button, styles.cta)}
            >
              Login
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://tower.nf/login"
              className={styles.button}
            >
              Sign up for free
            </a>
          </div>
        </motion.div>
      </AnimatePresence> */}
    </>
  );
};

export default Menu;
