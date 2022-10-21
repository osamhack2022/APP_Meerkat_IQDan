import { StyleSheet, View, Text, Image } from "react-native";
import { isEmpty } from "../../common/isEmpty";
import { Category, UserEvent } from "../../common/types.d";

/**
 * @param event typeof enum UserEvent | null
 * @returns the image layer according to the image type.
 */
 function getEventImage(event: UserEvent | null | undefined) {
    if (event === UserEvent.NONE || isEmpty(event)) {
      return <></>;
    }
    if (event === UserEvent.RESERVE) {
      return (
        <Image
          style={styles.eventImage}
          source={require("../../assets/users/reserving.jpg")}
        />
      );
    } else if (event === UserEvent.PROMOTION) {
      return (
        <Image
          style={styles.eventImage}
          source={require("../../assets/users/promotion.jpg")}
        />
      );
    }
}

export default function CategoryBox(props: Category) {
  const { categoryName, event } = props;

  return (
    <View> 
        <View style={styles.horizontalLine}/>
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>
                {categoryName}
            </Text>
            {getEventImage(event)}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    categoryContainer:{
        height: 42,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
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
        borderWidth: 0.6,
        borderColor: "#EBEBEB",
    },
    eventImage:{
      marginLeft: 5,
      marginTop: 1,
      width: 15,
      height: 15
    }
})



