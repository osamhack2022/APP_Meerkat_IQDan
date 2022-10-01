// core
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
// type
import { Category } from "../common/types";
// dummy data
import dummy from "../assets/dummy_data/chatroom.json";
import Searchbar from "./ChatRoomList/Searchbar";

export default function Header(props: Category) {
  const { categoryName } = props;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{categoryName}</Text>
        <Text style={[styles.title]}>+</Text>
      </View>
      <Searchbar/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#fff",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 25,
    fontFamily: "noto-bold",
    lineHeight: 45
  }
});
