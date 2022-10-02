
import { createContext } from "react";
export const LoginContext = createContext({
    refreshLoginToken: () => {},
    isNotLoggedIn: false,
});