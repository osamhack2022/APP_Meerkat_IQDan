
import { useContext, useEffect } from "react"
import { LoginContext } from "../common/Context"

export default function useAuthRoute() {
    const { checkIfLoggedIn, isNotLoggedIn } = useContext(LoginContext);
    useEffect(() => {
        checkIfLoggedIn()
    }, [])
}