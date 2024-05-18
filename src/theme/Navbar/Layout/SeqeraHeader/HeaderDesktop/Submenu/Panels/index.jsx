import React from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

import Link from "./Link";
import AngleRight from "../../../_shared/angle-right.inline.svg";

import styles from "./styles.module.css";

const navVariants = {
  enter: { opacity: 0 },
  idle: { opacity: 1, zIndex: 2 },
  exit: { opacity: 0 },
};

const transition = {
  ease: "linear",
  duration: 0.2,
};

const Panels = ({ children, products, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="enter"
          animate="idle"
          exit="exit"
          variants={navVariants}
          transition={transition}
          className={clsx(styles.panels, {
            [styles.products]: products,
          })}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Panel = ({
  Image,
  imageURL,
  title,
  subtitle,
  children,
  links,
  externalLinks,
  footer,
  cta,
  ctas,
  highlighted,
  large,
  className,
}) => {
  let CTAs = ctas || [];
  if (cta) CTAs = [cta];
  return (
    <div
      className={clsx(styles.panel, className, {
        [styles.highlighted]: highlighted,
        [styles.large]: large,
      })}
    >
      {Image ? (
        <Link to={imageURL} className={clsx("block", styles.panelTitle)}>
          <Image />
        </Link>
      ) : title ? (
        <h3 className={styles.panelTitle}>{title}</h3>
      ) : null}
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      {children ? children : null}
      {links && (
        <ul>
          {Object.keys(links).map((key, i) => (
            <li key={i}>
              {externalLinks ? (
                <a href={links[key]} target="_blank" rel="noreferrer">
                  {key} <AngleRight />
                </a>
              ) : (
                <Link to={links[key]}>
                  {key} <AngleRight />
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
      {footer && <div className={styles.panelFooter}>{footer}</div>}
      {!footer && !!CTAs.length && (
        <div className={styles.panelFooter}>
          {CTAs.map((cta, i) => (
            <Link key={i} to={cta.href} className={styles.cta}>
              {cta.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

Panels.Panel = Panel;

export default Panels;
