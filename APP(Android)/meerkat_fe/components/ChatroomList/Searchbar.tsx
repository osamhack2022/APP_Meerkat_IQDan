import { StyleSheet, View, Text, Image, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

const searchImg = require("../../assets/icons/search.png");

export default function Searchbar(props: {searchText: string, setTextChange: (s: string) => void}) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.icon}
        source={searchImg}
      />
      <TextInput
        value={props.searchText}
        onChangeText={props.setTextChange} 
        style={{ paddingLeft: 8, flexGrow: 1 }} 
        placeholder="대화방을 검색하십시오" 
        placeholderTextColor="#D3B1A8"
      />
      <TouchableOpacity onPress={() => props.setTextChange("")}>
        <MaterialIcons size={20} color="#D3B1A8" name='cancel' /> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    backgroundColor: "#FFF6EC",
    borderColor: "#D3B1A8",
    borderWidth: 1,
    borderRadius: 15,
    // justifyContent: "center"
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    color: "#D3B1A8",
  },
  icon: {
    resizeMode: "contain",
    width: 20,
    tintColor: "#D3B1A8",
  },
});
