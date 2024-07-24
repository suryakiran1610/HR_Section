import { useContext } from "react";
import { SidebarContext } from "../context/sidebarContext";

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebarContext must be used within the SidebarContextProvider"
    );
  }

  return context;
};
