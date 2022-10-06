import { StyleSheet, View, Text } from "react-native";

export default function FriendBox() {
  return (
    <View style={styles.container}>
      <View style={styles.profileImage}/>
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}> </Text>
        <Text style={styles.statusMessageText}> </Text>
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
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 17,
    marginLeft: 18,
    marginRight: 12,
    backgroundColor: "#DBDBDB",
  },
  nameContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 36
  },
  nameLayout: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 7,
  },
  nameText: {
    height: 18,
    width: 40,
    backgroundColor: "#DBDBDB",
  },
  statusMessageText: {
    height: 11,
    width: 90,
    backgroundColor: "#DBDBDB",
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