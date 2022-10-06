import { useRef } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";

export default function MyBoxLoading() {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const circleAnimatedValue = new Animated.Value(0);
    const circleAnimated = () => {
        circleAnimatedValue.setValue(0)
        Animated.timing(
          circleAnimatedValue,
          {
              toValue: 1,
              duration: 350,
              useNativeDriver: false
          }
        ).start(() => {
          setTimeout(() => {
            circleAnimated()
          }, 1000);
        })
      }
      circleAnimated();

      const translateX = circleAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 100]
      })


      const beate = useRef(new Animated.Value(0)).current;


      Animated.loop(
          Animated.sequence([
              Animated.timing(beate, {
                  toValue: 1,
                  duration: 1000,
                  useNativeDriver: true,
              }),
              Animated.timing(beate, {
                  toValue: 0,
                  duration: 1000,
                  useNativeDriver: true,
              }),
          ])
      ).start();
    

  return (
    <View style={styles.container}>
        <View style={styles.profileImage}>
        <Animated.View style={{ width: '30%', opacity: 0.5, height: '100%', backgroundColor: 'white', transform: [{ translateX: translateX }] }}></Animated.View>
        </View>

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



