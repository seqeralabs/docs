import { createContext, useContext } from "react"

const HeaderContext = createContext({})

const useHeaderContext = () => {
  return useContext(HeaderContext)
}

export { HeaderContext, useHeaderContext }
