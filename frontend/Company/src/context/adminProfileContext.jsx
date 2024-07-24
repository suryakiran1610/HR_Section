import { createContext, useEffect, useReducer } from "react";

export const AdminProfileContext = createContext();

export const adminProfileReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: action.payload,
      };
    default:
      return state;
  }
};

export const AdminProfileContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminProfileReducer, {
    profile: JSON.parse(localStorage.getItem("adminProfile")) || null,
  });

  useEffect(() => {
    localStorage.setItem("adminProfile", JSON.stringify(state.profile));
  }, [state.profile]);

  console.log("AdminProfileContext state", state);

  return (
    <AdminProfileContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AdminProfileContext.Provider>
  );
};
