import React, { useEffect } from "react";
import clsx from "clsx";
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal";
import SeqeraMenu from "../SeqeraMenu";

import styles from "./styles.module.css";

function Button({ onClick, children }) {
  return (
    <button
      type="button"
      className={clsx("clean-btn navbar-sidebar__back", styles.button)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function NavButtons({ currentPanel, setPanel }) {
  return (
    <>
      {currentPanel === 1 && (
        <Button onClick={setPanel(2)}>Docs navigation ➔</Button>
      )}
      {currentPanel === 2 && (
        <Button onClick={setPanel(1)}>← Home navigation</Button>
      )}
      {currentPanel === 3 && (
        <Button onClick={setPanel(2)}>← Top level docs</Button>
      )}
    </>
  );
}

export default function NavbarMobileSidebarLayout({ header, primaryMenu }) {
  const level3 = useNavbarSecondaryMenu();
  const [currentPanel, setCurrentPanel] = React.useState(level3.shown ? 3 : 2);

  useEffect(() => {
    setCurrentPanel(level3.shown ? 3 : 2);
  }, [level3.shown]);

  function setPanel(index) {
    return () => {
      if (index !== 3) level3.hide();
      setCurrentPanel(index);
    };
  }

  return (
    <div className="navbar-sidebar">
      {header}
      <div
        className={clsx("navbar-sidebar__items", styles.panels, {
          [styles.panel1Active]: currentPanel === 1,
          [styles.panel2Active]: currentPanel === 2,
          [styles.panel3Active]: currentPanel === 3,
        })}
      >
        <div className="navbar-sidebar__item menu">
          <NavButtons currentPanel={currentPanel} setPanel={setPanel} />
          <SeqeraMenu />
        </div>
        <div className="navbar-sidebar__item menu">
          <NavButtons currentPanel={currentPanel} setPanel={setPanel} />
          {primaryMenu}
        </div>
        <div className="navbar-sidebar__item menu">
          <NavButtons currentPanel={currentPanel} setPanel={setPanel} />
          {level3.content}
        </div>
      </div>
    </div>
  );
}
