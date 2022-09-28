import { StyleSheet, View, Text, Image } from "react-native";

export default function Searchbar() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.icon}
        source={require("../assets/icons/search.png")}
      />
      <Text style={styles.text}>대화방을 검색하십시오</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    backgroundColor: "#FFF6EC",
    borderColor: "#D3B1A8",
    borderWidth: 1,
    borderRadius: 15,
    // justifyContent: "center"
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    color: "#D3B1A8",
  },
  icon: {
    resizeMode: "contain",
    width: 20,
    tintColor: "#D3B1A8",
  },
});
