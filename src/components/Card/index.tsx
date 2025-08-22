import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

type Props = {
  to: string;
  title: string;
  Img?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  id?: string;
  children: React.ReactNode;
};

const Card: React.FC<Props> = ({ children, to, title, Img, id }) => {
  const isExternal = to?.startsWith("http");

  if (isExternal)
    return (
      <a
        href={to}
        target="_blank"
        className={clsx(styles.card, styles[id])}
        rel="noopener noreferrer"
      >
        <h3>{title}</h3>
        {Img && (
          <div>
            <Img className={id ? styles[id] : ""} />
          </div>
        )}
        <div className={styles.description}>
          {children}
        </div>
      </a>
    );

  return (
    <Link to={to} className={clsx(styles.card, styles[id])}>
      <h3>{title}</h3>
      {Img && (
        <div>
          <Img />
        </div>
      )}
      <div className={styles.description}>
        {children}
      </div>
    </Link>
  );
};

export default Card;
