import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";

export default function useLoginCheck(refresherFlag: boolean) {
    const [token, setToken] = useState<string | null>(null); // null implies loading

    useEffect(() =>{
        getCurrentLoginToken();
    },[refresherFlag])
    
    const getCurrentLoginToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken')
            const expDate = await AsyncStorage.getItem('userTokenExpiration')
            if (token === null || expDate === null) { // existence check
                setToken("")
            } else if (Date.now() >= Date.parse(expDate)) { // expiry check
                setToken("")
            } else {
                setToken(token)
            } 
        } catch(e) {
            // may be leave a log to a .log or db
            // also trigger system error message.
            return "unknown error"
        }
    }

    return token;
}