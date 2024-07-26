import { createContext, useReducer, useEffect } from "react";

export const SidebarContext = createContext();

const initialState = {
  isSidebarCollapsed: true,
};

const sidebarReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      const newState = {
        ...state,
        isSidebarCollapsed: !state.isSidebarCollapsed,
      };
      localStorage.setItem("sidebarState", JSON.stringify(newState));
      return newState;
    default:
      return state;
  }
};

export const SidebarContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sidebarReducer, initialState, () => {
    const storedState = localStorage.getItem("sidebarState");
    return storedState ? JSON.parse(storedState) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(state));
  }, [state]);

  return (
    <SidebarContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SidebarContext.Provider>
  );
};
