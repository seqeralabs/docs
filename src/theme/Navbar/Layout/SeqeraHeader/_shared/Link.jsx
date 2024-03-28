import React from "react";
import DocusaurusLink from "@docusaurus/Link";

const Link = ({ children, className, onClick, title, ...props }) => {
  const to = props?.to || props?.href;
  const isExternal = !to?.startsWith("https://seqera.io");

  return (
    <DocusaurusLink
      to={to}
      onClick={onClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={className}
      title={title}
    >
      {children}
    </DocusaurusLink>
  );
};

export default Link;
