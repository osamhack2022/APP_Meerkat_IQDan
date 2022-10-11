import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback } from "react";
import jwtDecode from 'jwt-decode';

export default function useLoginCheck() {
    // login state refresher
    const [refresherFlag, setTokenRefresherFlag] = useState<boolean>(false);

    //flags
    const [isLoginLoading, setIsLoginLoading] = useState(true);
    const [isNotLoggedIn, setIsNotLoggedIn] = useState(true);
    
    const [userId, setUserId] = useState<number>(-1);

    useEffect(() =>{
        getCurrentLoginToken();
    },[refresherFlag])
    
    // check if logged in by 
    const checkIfLoggedIn = () => {
        setTokenRefresherFlag(!refresherFlag);
    };
    
    const getCurrentLoginToken = async () => {
        try {
            let loginToken = null
            const token = await AsyncStorage.getItem('userToken')
            const expDate = await AsyncStorage.getItem('userTokenExpiration')
            if (token === null || expDate === null) { // existence check
                loginToken = ""
            } else if (Date.now() >= Number(expDate)) { // expiry check
                loginToken = ""
            } else {
                loginToken = token
            } 
            loginToken === null ? setIsLoginLoading(true): setIsLoginLoading(false) 
            loginToken === "" ? setIsNotLoggedIn(true) : setIsNotLoggedIn(false)

            if (token !== null) {
                const tokenObject: any = jwtDecode(token)
                setUserId(tokenObject.id)
            }
        } catch(e) {
            // may be leave a log to a .log or db
            // also trigger system error message.
            return "unknown error"
        }
    }

    return { checkIfLoggedIn, isLoginLoading, isNotLoggedIn, userId};
}