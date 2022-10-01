import Login from "../pages/Login";
import Register from "../pages/Register";
import ChangePw from "../pages/ChangePw";
import { useState, useContext, createContext } from "react";
export const PageContext = createContext({
    page: "login",
    setPage: (s: string) => {},
});

export default function Auth(props: { refreshLoginToken: Function }) {
    const { refreshLoginToken } = props;
    const [currPage, setCurrPage] = useState<string>("login");

    const showCurrPage = () => {
        switch (currPage) {
            case "login":
                return <Login />;
            case "register":
                return <Register />;
            case "changePw":
                return <ChangePw />;
        }
    };

    return (
        <PageContext.Provider value={{ page: currPage, setPage: setCurrPage }}>
            {showCurrPage()}
        </PageContext.Provider>
    );
}
