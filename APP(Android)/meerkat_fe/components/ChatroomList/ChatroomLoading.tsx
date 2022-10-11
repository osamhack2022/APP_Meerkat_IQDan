import { useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import getGlitterStyle from "../FriendList/getGlitterStyle";


export default function ChatroomLoading() {
    const animatedValue = useRef(new Animated.Value(0.4)).current;

    return (
    <>
    <View style={styles.container}>
    <Animated.View style={getGlitterStyle(animatedValue)} />
</View>
<View style={styles.container}>
    <Animated.View style={getGlitterStyle(animatedValue)} />
</View>
<View style={styles.container}>
    <Animated.View style={getGlitterStyle(animatedValue)} />
</View>
<View style={styles.container}>
    <Animated.View style={getGlitterStyle(animatedValue)} />
</View>
<View style={styles.container}>
    <Animated.View style={getGlitterStyle(animatedValue)} />
</View>
<View style={styles.container}>
    <Animated.View style={getGlitterStyle(animatedValue)} />
</View>
<View style={styles.container}>
    <Animated.View style={getGlitterStyle(animatedValue)} />
</View>
<View style={{height: 200}}>
            </View>

</>
    )

}

const styles=StyleSheet.create({container: {
    marginTop: 10,
    height: 130,
    backgroundColor: "#DBDBDB",
    borderRadius: 20,
    justifyContent:"space-between"
}});