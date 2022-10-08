import { StyleSheet, View, Text, Image } from "react-native";
import getProfileSource from "./getProfileSource";
import { UserEvent, UserProfile } from "../../common/types.d";
import { isEmpty, isEmptyString } from "../../common/isEmpty";

export default function FriendBox(props: UserProfile) {
  const { name, image, statusMessage } = props; // profile image must be delivered as prop

  const dday: number = props.dday as number;
  const ProfileImageSource = getProfileSource(image);
  const ddayStr = `D${dday > 0 ? '-' : '+'}${Math.abs(dday)}`

  return (
    <View style={styles.container}>
      <Image style={styles.profileImage} source={ProfileImageSource} />
      <View style={styles.nameContainer}>
        <View style={styles.nameLayout}>
          <Text style={styles.nameText}>{name}</Text>
        </View>
        {(isEmpty(statusMessage) || isEmptyString(statusMessage!)) ? (
          <></>
        ) : (
          <Text style={styles.statusMessageText}>{statusMessage}</Text>
        )}
      </View>
      {isEmpty(dday) ? (
        <></>
      ) : (
        <View style={styles.ddayContainer}>
          <Text style={styles.ddayText}>{ddayStr}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 65,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 17,
    marginLeft: 18,
    marginRight: 12,
  },
  nameContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  nameLayout: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 18,
    fontFamily: "noto-reg",
    lineHeight: 25,
  },
  statusMessageText: {
    fontSize: 11,
    color: "rgba(0, 0, 0, 0.45)",
    fontFamily: "noto-reg",
    lineHeight: 20,
  },
  ddayContainer: {
    position: "absolute",
    borderRadius: 4,
    padding: 4,
    right: 18,
    backgroundColor: "#D6D6D6",
  },
  ddayText: {
    flex: 1,
    fontSize: 12,
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: "noto-reg",
    lineHeight: 15,
  },
});
