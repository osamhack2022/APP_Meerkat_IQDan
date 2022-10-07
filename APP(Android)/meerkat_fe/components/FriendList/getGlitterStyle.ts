import { Animated } from "react-native";

/**
 * using example
 * @setParam const glitter = useRef(new Animated.Value(0.4)).current;
 * @getStyle const glitterStyle = getGlitterStyle(glitter);
 * @useStyle <Animated.View style={glitterStyle}/>
 * 
 * @param glitter typeof Animated.Value
 * @returns animated style
 */
export default function getGlitterStyle(animatedValue: Animated.Value){
    Animated.loop(
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 750,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 0.4,
                duration: 750,
                useNativeDriver: true,
            }),
        ])
    ).start();
    const glitterStyle = {
        opacity: animatedValue,
        height: "100%",
        width: "100%",
        backgroundColor: "white",
    };
    return glitterStyle;
}


