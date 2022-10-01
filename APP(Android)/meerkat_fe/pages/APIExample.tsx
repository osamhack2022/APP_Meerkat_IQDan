// core
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";
// type
import { User } from "../common/types";
// routing
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

import { Logs } from 'expo'

Logs.enableExpoCliLogging();

type TestScreenProps = NativeStackScreenProps<RootStackParamList, "Test">;

export default function APIExample(props: TestScreenProps) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUsers = async () => {
    try{
        const response = await axios.get("https://code.seholee.com:8082/users"); // get user list
        // console.log(response)
        setUsers(response.data.data);
    }
    catch(e:any){
      console.log(e.response);
      setError(e);
    }
    finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  if (isLoading) return <Text>머기중..</Text>;
  if (error) return <Text>먼가.... 먼가 일어나고 있음... </Text>;
  if (!users) return <Text>비었습니다.</Text>;  
  return (
  <View>
    {users.map((user: User) => {
      return <View key={user.userId}>
        <Text>{user.userId}</Text>
        <Text>{user.uid}</Text>
        <Text>{user.password}</Text>
        <Text>{user.name}</Text>
        <Text>{user.militaryRank}</Text>
        <Text>{user.affiliatedUnit}</Text>
      </View>
    })}
  </View>
  );
}