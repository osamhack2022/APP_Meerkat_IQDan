import { useRef } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";

export default function MyBoxLoading() {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const twinkle = Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
    }).start();

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
        }).start();
    };

    const eternalfadein = () => {
        //Animated.loop(twinkle, { iterations: -1 }).start();
    };

    

  return (
    <View style={styles.container}>
        
        <Animated.View style={[styles.profileImage, {opacity: fadeAnim}]}></Animated.View>
        <View style={styles.nameContainer}>
            <Animated.Text style={styles.nameText}> </Animated.Text>
            <Text style={styles.statusMessageText}> </Text>
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
    },
    profileImage:{
        width: 65,
        height: 65,
        borderRadius: 19,
        marginLeft: 18,
        marginRight: 12,
        backgroundColor: "#DBDBDB"
    },
    nameContainer: {
        flexDirection: "column",
    },
    nameText:{
        lineHeight: 25,
        height: 19,
        backgroundColor: "#DBDBDB",
        width: 45
    },
    statusMessageText:{
        marginTop: 7,
        height: 11,
        backgroundColor: "#DBDBDB",
        width: 90
    }
})



