import { StyleSheet, View, Text } from "react-native";
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
        fontSize: 11,
        fontFamily: "noto-reg"
    },
    horizontalLine:{
        marginLeft: 17,
        marginRight: 17,
        width: "auto",
        borderWidth: 0.2,
        borderColor: "#EBEBEB",
    }
})



