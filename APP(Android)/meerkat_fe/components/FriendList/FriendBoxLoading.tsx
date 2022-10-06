import { StyleSheet, View, Text, Image } from "react-native";
import { UserEvent, UserProfile } from "../../common/types";

export default function FriendBox(props: UserProfile) {
  return (
    <View style={styles.container}>
      <View style={styles.profileImage}/>
      <View style={styles.nameContainer}>
        <View style={styles.nameLayout}>
          <Text style={styles.nameText}></Text>
          <Text style={styles.statusMessageText}></Text>
        </View>
        <Text style={styles.statusMessageText}></Text>
      </View>
        <View style={styles.ddayContainer}>
          
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 65,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    backgroundColor: "white",
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 17,
    marginLeft: 18,
    marginRight: 12,
    backgroundColor: "gray",
    
  },
  nameContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  nameLayout: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 18,
    fontFamily: "noto-reg",
    lineHeight: 25,
    backgroundColor: "gray",
  },
  statusMessageText: {
    fontSize: 11,
    color: "rgba(0, 0, 0, 0.45)",
    fontFamily: "noto-reg",
    lineHeight: 20,
    backgroundColor: "gray",
  },
  ddayContainer: {
    position: "absolute",
    borderRadius: 4,
    padding: 4,
    right: 18,
    backgroundColor: "gray",
  }
});

/*
@KeyframeEffect pulse {
  0% {
    background-color: #94a3b8;
  }

  50% {
    background-color: #cbd5e1;
  }

  100% {
    background-color: #94a3b8;
  }
}
*/
//https://github.com/FE-Lex-Kim/-TIL/blob/master/%EC%84%B1%EB%8A%A5%20%EC%B5%9C%EC%A0%81%ED%99%94/%EC%8A%A4%EC%BC%88%EB%A0%88%ED%86%A4%20UI%20(Skeleton%20UI).md