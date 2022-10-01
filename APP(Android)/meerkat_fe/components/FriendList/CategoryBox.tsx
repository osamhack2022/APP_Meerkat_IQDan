import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import { Category } from "../../common/types";

export default function CategoryBox(props: Category) {
  const { categoryName } = props;

  return (
    <View style={styles.container}> 
        <View style={styles.horizontalLine}/>
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>
                {categoryName}
            </Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "white"
    },
    categoryContainer:{
        height: 42,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center"
    },
    categoryText:{
        marginLeft: 17,
        textAlignVertical: "center",
        fontSize: 14
    },
    horizontalLine:{
        marginLeft: 17,
        width: "auto",
        borderWidth: 0.1,
        borderColor: "#EBEBEB",
    }
})



