import { StyleSheet, View, Animated } from "react-native";
import { AnimatedValue } from "../../common/types";
import getGlitterStyle from "./getGlitterStyle";

export default function CategoryBoxLoading(props: AnimatedValue) {
    // glittering animation while loading
    const { animatedValue } = props;
    const glitterStyle = getGlitterStyle(animatedValue);

    return (
        <View style={styles.container}>
            <View style={styles.horizontalLine} />
            <View style={styles.categoryContainer}>
                <View style={styles.categoryText}>
                    <Animated.View style={glitterStyle} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    categoryContainer: {
        height: 42,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
    },
    categoryText: {
        marginLeft: 17,
        backgroundColor: "#DBDBDB",
        width: 80,
        height: 11,
    },
    horizontalLine: {
        marginLeft: 17,
        marginRight: 17,
        width: "auto",
        borderWidth: 0.6,
        borderColor: "#EBEBEB",
    },
});
