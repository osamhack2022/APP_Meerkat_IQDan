import { StyleSheet, View, Animated } from "react-native";
import { AnimatedValue } from "../../common/types";
import getGlitterStyle from "./getGlitterStyle";

export default function FriendBox(props: AnimatedValue) {
    // glittering animation while loading
    const { animatedValue } = props;
    const glitterStyle = getGlitterStyle(animatedValue);

    return (
        <View style={styles.container}>
            <View style={styles.profileImage}>
                <Animated.View style={glitterStyle} />
            </View>
            <View style={styles.nameContainer}>
                <View style={styles.nameText}>
                    <Animated.View style={glitterStyle} />
                </View>
                <View style={styles.statusMessageText}>
                    <Animated.View style={glitterStyle} />
                </View>
            </View>
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
        backgroundColor: "#DBDBDB",
    },
    nameContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        height: 36,
    },
    nameLayout: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 7,
    },
    nameText: {
        height: 18,
        width: 40,
        backgroundColor: "#DBDBDB",
    },
    statusMessageText: {
        height: 11,
        width: 90,
        backgroundColor: "#DBDBDB",
    },
});
