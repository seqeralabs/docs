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
        {Img ? (
          <div>
            <Img className={id ? styles[id] : ""} />
          </div>
        ) : (
          <h3>{title}</h3>
        )}
        {children}
      </a>
    );

  return (
    <Link to={to} className={clsx(styles.card, styles[id])}>
      {Img ? (
        <div>
          <Img />
        </div>
      ) : (
        <h3>{title}</h3>
      )}
      {children}
    </Link>
  );
};

export default Card;
