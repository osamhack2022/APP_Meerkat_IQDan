import Login from "../pages/Login";
import Register from "../pages/Register";
import ChangePw from "../pages/ChangePw";
import { useState } from "react";

export default function Auth(props: { refreshLoginToken: Function }) {
    const { refreshLoginToken } = props;
    const [currPage, setCurrPage] = useState<string>("");

        switch (currPage) {
            case "register":
                return <Register />
            case "changePw":
                return <ChangePw />
            default:
                return <Login setCurrPage={setCurrPage} refreshLoginToken={refreshLoginToken} />
        }
    }
