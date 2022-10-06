import { StyleSheet, View, Animated } from "react-native";
import { AnimatedValue } from "../../common/types";
import getGlitterStyle from "./getGlitterStyle";

export default function EventFriendBox(props: AnimatedValue) {
    // glittering animation while loading
    const { animatedValue } = props;
    const glitterStyle = getGlitterStyle(animatedValue);

    return (
        <View style={styles.container}>
            <View style={styles.profileImage}>
                <Animated.View style={glitterStyle} />
            </View>
            <View style={styles.nameText}>
                <Animated.View style={glitterStyle} />
            </View>
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
        backgroundColor: "#DBDBDB",
    },
    nameText: {
        height: 10,
        width: 40,
        backgroundColor: "#DBDBDB",
        marginBottom: 5,
    },
});
