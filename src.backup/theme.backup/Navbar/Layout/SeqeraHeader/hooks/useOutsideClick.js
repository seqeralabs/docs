import { useEffect } from "react";

export default function useOutsideClick(ref, handler, enabled) {
  useEffect(() => {
    const isSSR = typeof window === "undefined";
    if (!isSSR && enabled) {
      const listener = (event) => {
        const el = ref?.current;

        if (!el || el.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }

    return () => {};
  }, [ref, handler, enabled]);
}
