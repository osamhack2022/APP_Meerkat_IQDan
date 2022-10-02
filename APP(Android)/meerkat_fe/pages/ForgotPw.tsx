import { useContext } from "react"
import { View } from "react-native"

export default function ForgotPw(props: {setCurrPage: Function}) {
    const {setCurrPage} = props;


    const handleLogin = () => {
        setCurrPage("")
    };

    const handleRegister = () => {
        setCurrPage("register")
    };


    return <View></View>
}