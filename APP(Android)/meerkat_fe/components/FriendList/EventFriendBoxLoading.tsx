import { StyleSheet, View, Text, Image } from "react-native";

export default function EventFriendBox() {
  return (
    <View style={styles.container}>
      <View style={styles.profileImage} />
      <Text style={styles.nameText}> </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 68,
    width: 50,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: "#DBDBDB"
  },
  nameText: {
    height: 10,
    width: 40,
    backgroundColor: "#DBDBDB",
    marginBottom: 5
  }
});
