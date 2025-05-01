import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Resources from "./Resources";
import { useHeaderContext } from "../../context";

const navVariants = {
  enter: { y: -20, opacity: 0 },
  idle: { y: 0, opacity: 1 },
  exit: { opacity: 0, y: -20 },
};

const transition = {
  ease: "easeOut",
  duration: 0.2,
};

const Submenu = ({ hideMenu }) => {
  const { activeMenu, isMenuOpen } = useHeaderContext();
  // const activeMenu = "resources";
  // const isMenuOpen = true;
  if (hideMenu) return null;
  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial="enter"
          animate="idle"
          exit="exit"
          variants={navVariants}
          transition={transition}
          className="absolute top-16 right-4 bg-white rounded-md shadow-lg border border-gray-300 z-[999]"
        >
        
            <div className="w-full h-full p-2 ">
              {activeMenu === "resources" && <Resources />}
            </div>
       
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Submenu;
