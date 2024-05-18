import React from "react";
import DocusaurusLink from "@docusaurus/Link";

const Link = ({ children, className, onClick, title, ...props }) => {
  let to = props?.to || props?.href;
  if (!to.startsWith("http")) to = `https://seqera.io${to}`;
  const isExternal = true;

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
