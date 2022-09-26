import { StyleSheet, Text, View } from "react-native";

export default function ChatRoomList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>대화방</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingLeft: 10,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 40,
    fontFamily: "noto-bold",
  },
});
