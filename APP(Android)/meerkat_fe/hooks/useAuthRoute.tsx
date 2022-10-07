import { useContext, useEffect } from "react";
import { LoginContext } from "../common/Context";

export default function useAuthRoute() {
    const { checkIfLoggedIn } = useContext(LoginContext);
    // run everytime without useEffect.
    // useEffect(() => {
    checkIfLoggedIn();
    // }, [])
}
