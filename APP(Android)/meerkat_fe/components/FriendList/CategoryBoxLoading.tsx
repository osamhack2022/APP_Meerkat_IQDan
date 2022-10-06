import { StyleSheet, View, Text, Image } from "react-native";

export default function CategoryBox() {

  return (
    <View style={styles.container}> 
        <View style={styles.horizontalLine}/>
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}> </Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        
    },
    categoryContainer:{
        height: 42,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
    },
    categoryText:{
        marginLeft: 17,
        fontSize: 11,
        backgroundColor: "#DBDBDB",
        width: 80
    },
    horizontalLine:{
        marginLeft: 17,
        marginRight: 17,
        width: "auto",
        borderWidth: 0.6,
        borderColor: "#EBEBEB",
    }
})



