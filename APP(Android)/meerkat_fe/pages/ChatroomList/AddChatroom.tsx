import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackScreenProps } from "../../common/types";
import { useEffect, useState } from "react";

type Friend = {
    name: string,
    serviceNumber: string,
    affiliatedUnit: string,
    militaryRank: string,
}

export default function AddChatroom(props: RootStackScreenProps<"AddChatroom">) {
    const { navigation } = props;
    const [friends, setFriends] = useState<Friend[]>([])

    useEffect(() => {
        
    },[])

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
                    대화방 추가하기
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