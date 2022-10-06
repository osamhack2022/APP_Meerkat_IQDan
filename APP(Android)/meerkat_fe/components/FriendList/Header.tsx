// core
import { StyleSheet, Text, View } from "react-native";
// type
import { Category } from "../../common/types.d";
// dummy data
import Searchbar from "../ChatRoomList/Searchbar";

export default function Header(props: Category) {
  const { categoryName } = props;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleLayout}>
          <Text style={styles.title}>{categoryName}</Text>
          <Text style={[styles.title]}>+</Text>
        </View>
      </View>
      <View style={styles.horizontalLine}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  titleContainer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  titleLayout: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 25,
    fontFamily: "noto-bold",
    lineHeight: 45
  },
  
  horizontalLine:{
    marginTop: 10,
    width: "auto",
    borderWidth: 0.6,
    borderColor: "#EBEBEB",
  }
});
