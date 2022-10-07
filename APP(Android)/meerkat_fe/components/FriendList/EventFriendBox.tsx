import { StyleSheet, View, Text, Image } from "react-native";
import getProfileSource from "./getProfileSource";
import { UserEvent, UserProfile } from "../../common/types.d";

export default function EventFriendBox(props: UserProfile) {
  const { name, image } = props; // profile image must be delivered as prop
  const ProfileImageSource = getProfileSource(image);

  return (
    <View style={styles.container}>
      <Image style={styles.profileImage} source={ProfileImageSource} />
      <Text style={styles.nameText}>{name}</Text>
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
    borderRadius: 17
  },
  nameText: {
    fontSize: 10,
    fontFamily: "noto-reg",
    lineHeight: 25,
  }
});
