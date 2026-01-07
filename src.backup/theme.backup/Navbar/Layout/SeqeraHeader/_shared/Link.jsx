import React from "react";
import DocusaurusLink from "@docusaurus/Link";

const Link = ({ children, className, onClick, title, sameTab, ...props }) => {
  let to = props?.to || props?.href;

  if (to && !to.startsWith("http")) to = `https://seqera.io${to}`;
  let isExternal = true;
  if (sameTab) isExternal = false;

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
