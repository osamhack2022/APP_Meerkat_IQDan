// core
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
// type
import { Category } from "../../common/types.d";
// dummy data
import Searchbar from "../ChatroomList/Searchbar";
import { Foundation } from '@expo/vector-icons'; 

interface HeaderProps extends Category {
  onPressAdd: () => void
  refresh: () => void
}

export default function Header(props: HeaderProps) {
  const { categoryName, refresh } = props;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleLayout}>
          <Text style={styles.title}>{categoryName}</Text>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity style={{marginBottom: 5, marginRight: 10}} onPress={refresh}>
                <Foundation name="refresh" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={props.onPressAdd}>
                <Text style={styles.titleForIcon}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* <View style={styles.horizontalLine}/> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
  },
  titleContainer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  titleLayout: {
    flexDirection: "row",
    alignItems:"center",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 25,
    fontFamily: "noto-bold",
    lineHeight: 45
  },
  titleForIcon:{
    fontSize: 32,
    fontFamily: "noto-bold",
    lineHeight: 38
  },
  
  horizontalLine:{
    marginTop: 10,
    width: "auto",
    borderWidth: 0.6,
    borderColor: "#EBEBEB",
  }
});
