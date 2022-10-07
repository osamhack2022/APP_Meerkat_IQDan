import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { RootStackScreenProps } from "../../common/types";
import { Ionicons } from "@expo/vector-icons";

export default function MyProfile(props: RootStackScreenProps<"MyProfile">) {
    const { navigation } = props;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="chevron-back"
                        size={24}
                        color="black"
                    />
                    나의 프로필
                </Text>
            </View>
            

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "#fff",
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10,
    },
    title: {
        fontSize: 25,
        fontFamily: "noto-bold",
        lineHeight: 45,
    },
});
