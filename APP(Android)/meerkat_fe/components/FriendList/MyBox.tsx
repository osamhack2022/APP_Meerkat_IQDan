import { StyleSheet, View, Text, Image } from "react-native";
import { UserProfile } from "../../common/types.d";
import getProfileSource from "./getProfileSource";

export default function MyBox(props: UserProfile) {
  const { name, image, statusMessage } = props; // profile image must be delivered as prop

  const ProfileImageSource = getProfileSource(image);

  return (
    <View style={styles.container}>
        <Image style={styles.profileImage} source={ProfileImageSource}/>
        <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
                {name}
            </Text>
            <Text style={styles.statusMessageText}>
                {statusMessage}
            </Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        height: 91,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        backgroundColor: "white"
    },
    profileImage:{
        width: 65,
        height: 65,
        borderRadius: 19,
        marginLeft: 18,
        marginRight: 12
    },
    nameContainer: {
        flexDirection: "column",
    },
    nameText:{
        fontSize: 19,
        fontFamily: "noto-reg",
        lineHeight: 25,
    },
    statusMessageText:{
        marginTop: 3,
        fontSize: 11,
        fontFamily: "noto-reg",
        lineHeight: 20,
        color: "rgba(0, 0, 0, 0.45)"
    }
})



