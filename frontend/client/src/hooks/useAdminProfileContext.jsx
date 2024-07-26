import { useContext } from "react";
import { AdminProfileContext } from "../context/adminProfileContext";

export const useAdminProfileContext = () => {
  const context = useContext(AdminProfileContext);

  if (!context) {
    throw new Error(
      "useAdminProfileContext must be used within the AdminProfileContextProvider"
    );
  }

  return context;
};
