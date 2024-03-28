import React from "react";

import Link from "../../../_shared/Link";
import { useHeaderContext } from "../../../context";

const PanelLink = ({ children, to, className }) => {
  const { closeMenu } = useHeaderContext();
  function handleClick(e) {
    if (e.shiftKey || e.ctrlKey || e.metaKey) return;
    closeMenu();
  }
  return (
    <Link to={to} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default PanelLink;
