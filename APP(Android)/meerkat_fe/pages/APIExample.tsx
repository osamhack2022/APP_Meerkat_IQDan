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
import dummy from "../assets/dummy_data/users.json";

Logs.enableExpoCliLogging();



type TestScreenProps = NativeStackScreenProps<RootStackParamList, "Test">;

export default function APIExample(props: TestScreenProps) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUsers = async () => {
    try {
      console.log("엄준식");
      const response = await axios.get("http://34.64.117.61:8082/users/"); // get user list
      console.log(response);
      setUsers(response.data);
    }
    catch (e: any) {
      console.log(e);
      setError(e);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    //getUsers();
    console.log("ERR" + error);
    setUsers(dummy.data);
    console.log(dummy.data);
  }, []);

  // if (isLoading) return <Text>머기중..</Text>;
  // if (error) return <Text>먼가.... 먼가 일어나고 있음...</Text>;
  // if (!users) return <Text>비었습니다.</Text>;
  // return (

  //   users.map((user) =>{
  //     return(
  //       <View><Text>{user.name}asd</Text></View>
  //     )
  //   })
  // );
  return <View style={styles.container}><Text>asdf</Text></View>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "green"
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 25,
    fontFamily: "noto-bold",
    lineHeight: 45
  },
});