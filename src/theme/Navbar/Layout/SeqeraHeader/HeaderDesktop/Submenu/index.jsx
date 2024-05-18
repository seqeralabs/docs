import React from "react"
import { motion, AnimatePresence } from "framer-motion"

import Products from "./Products"
import Resources from "./Resources"

import { useHeaderContext } from "../../context"

const navVariants = {
  enter: { y: -20, opacity: 0 },
  idle: { y: 0, opacity: 1 },
  exit: { opacity: 0, y: -20 },
}

const transition = {
  ease: "easeOut",
  duration: 0.2,
}

const Submenu = ({ hideMenu }) => {
  const { activeMenu, isMenuOpen } = useHeaderContext()
  // const activeMenu = "products"
  // const isMenuOpen = true
  if (hideMenu) return null
  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial="enter"
          animate="idle"
          exit="exit"
          variants={navVariants}
          transition={transition}
          className="absolute top-[100%] left-0 right-0"
        >
          <div className="container-lg p-2 ">
            <div className="relative bg-white rounded-md p-2 shadow-lg">
              {activeMenu === "products" && <Products />}
              {activeMenu === "resources" && <Resources />}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Submenu
