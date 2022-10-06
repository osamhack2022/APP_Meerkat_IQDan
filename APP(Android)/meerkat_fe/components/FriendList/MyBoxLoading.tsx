import { StyleSheet, View, Animated } from "react-native";
import { AnimatedValue } from "../../common/types";
import getGlitterStyle from "./getGlitterStyle";

export default function MyBoxLoading(props: AnimatedValue) {
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
        height: 91,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    profileImage: {
        width: 65,
        height: 65,
        borderRadius: 19,
        marginLeft: 18,
        marginRight: 12,

        backgroundColor: "#DBDBDB",
    },
    nameContainer: {
        flexDirection: "column",
    },
    nameText: {
        lineHeight: 25,
        height: 19,
        backgroundColor: "#DBDBDB",
        width: 45,
    },
    statusMessageText: {
        marginTop: 7,
        height: 11,
        backgroundColor: "#DBDBDB",
        width: 90,
    },
});
