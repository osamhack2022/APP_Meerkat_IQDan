import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback } from "react";

export default function useLoginCheck() {
    const [loginToken, setToken] = useState<string | null>(null); // null implies loading
    // login state refresher
    const [refresherFlag, setTokenRefresherFlag] = useState<boolean>(false);

    //flags
    const [isLoginLoading, setIsLoginLoading] = useState(true);
    const [isNotLoggedIn, setIsNotLoggedIn] = useState(true);
    

    useEffect(() =>{
        getCurrentLoginToken();
    },[refresherFlag])

    useEffect(() => {
        loginToken === null ? setIsLoginLoading(true): setIsLoginLoading(false) 
        loginToken === "" ? setIsNotLoggedIn(true) : setIsNotLoggedIn(false)
    }, [loginToken])
    
    // refresh login token to get new data from asyncstorage
    const refreshLoginToken = () => {
        setTokenRefresherFlag(!refresherFlag);
    };
    
    const getCurrentLoginToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken')
            const expDate = await AsyncStorage.getItem('userTokenExpiration')
            if (token === null || expDate === null) { // existence check
                setToken("")
            } else if (Date.now() >= Number(expDate)) { // expiry check
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

    return {loginToken, refreshLoginToken, isLoginLoading, isNotLoggedIn};
}