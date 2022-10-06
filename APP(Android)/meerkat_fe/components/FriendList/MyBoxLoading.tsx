import { StyleSheet, View, Text, Animated } from "react-native";
import { GlitterAnimation } from "../../common/types.d";

export default function MyBoxLoading(props: GlitterAnimation) {
    const { glitterStyle } = props.glitterStyle;
    return (
        <View style={styles.container}>
            <View style={styles.profileImage}>
                <Animated.View style={glitterStyle}> </Animated.View>
            </View>

            <View style={styles.nameContainer}>
                <Animated.Text style={styles.nameText}> </Animated.Text>

                <Text style={styles.statusMessageText}> </Text>
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
