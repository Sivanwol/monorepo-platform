'use client'
import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.documentElement.classList;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, [colorMode]);

  return [colorMode, setColorMode];
};
