import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal";
import SeqeraMenu from "../SeqeraMenu";
import Caret from "./Caret.svg"
import styles from "./styles.module.css";

function Button({ onClick, children }) {
  return (
    <button
      type="button"
      className={clsx("flex flex-row items-center clean-btn navbar-sidebar__back", styles.button)}
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
        <Button onClick={setPanel(2)}>Docs Menu <div className="caret ml-2"><Caret/></div></Button>
      )}
      {currentPanel === 2 && (
        <Button onClick={setPanel(1)}><div className={`${styles.caretRotate} mr-2`}><Caret/></div> Main Menu</Button>
      )}
    </>
  );
}

export default function NavbarMobileSidebarLayout({ header, primaryMenu }) {
  const level2 = useNavbarSecondaryMenu();
  const [currentPanel, setCurrentPanel] = React.useState(level2.shown ? 2 : 2);
  const [mainMenu, setMainMenu] = useState(false);

  useEffect(() => {
    setCurrentPanel(level2.shown ? 2 : 1);
  }, [level2.shown]);

  function setPanel(index) {
    return () => {
      if (index !== 2) level2.hide();
      setCurrentPanel(index);
    };
  }

    useEffect(() => {
      if (location.pathname =='/') {
        setMainMenu(false);
      } else {
        setMainMenu(true);
      }
    }, [location.pathname]);


  return (
    <div className="navbar-sidebar">
      {header}
      <div
        className={clsx("navbar-sidebar__items", styles.panels, {
          [styles.panel1Active]: currentPanel === 1,
          [styles.panel2Active]: currentPanel === 2,
        })}
      >
        <div className="navbar-sidebar__item menu mb-2">
          <div className={`${!mainMenu && "hidden"}`}>
            <NavButtons currentPanel={currentPanel} setPanel={setPanel} />
          </div>
          <SeqeraMenu />
        </div>
        <div className="navbar-sidebar__item menu mb-4">
          <NavButtons currentPanel={currentPanel} setPanel={setPanel} />
          {level2.content}
        </div>
      </div>
    </div>
  );
}
