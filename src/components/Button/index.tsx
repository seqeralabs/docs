import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

import Arrow from "./arrow.inline.svg";

type Props = {
  to: string;
  children: React.ReactNode;
  cta?: boolean;
  arrow?: boolean;
  className?: string;
};

const Button: React.FC<Props> = ({ to, children, cta, className, arrow }) => {
  const isExternal = to?.startsWith("http");

  if (isExternal)
    return (
      <a
        href={to}
        target="_blank"
        className={clsx(styles.button, className, { [styles.cta]: cta })}
        rel="noopener noreferrer"
      >
        {children}
        {arrow && <Arrow />}
      </a>
    );

  return (
    <Link
      to={to}
      className={clsx(styles.button, className, { [styles.cta]: cta })}
    >
      {children}
      {arrow && <Arrow />}
    </Link>
  );
};

export default Button;
