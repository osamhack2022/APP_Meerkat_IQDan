import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { getImage } from '../../common/getImage';
import { AllClear } from '../../common/types';

export default function AllClearBox(props: AllClear) {
  const user = props.user;
  return (
    <>
      <View style={styles.allClearContainer}>
        <View style={styles.mainContainer}>
          <View style={styles.personContainer}>
            <Image style={styles.profileImage} source={getImage(user.image)} />
            <View style={styles.nameLayout}>
              <Text style={styles.nameText}>{user.militaryRank} </Text>
              <Text style={styles.nameText}>{user.name}</Text>
            </View>
          </View>
          <View style={styles.horizontalLine} />
          <View style={styles.textBox}>
            <Text style={styles.text}>{props.content}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  allClearContainer:{
    flexDirection:"row", 
    justifyContent:"center",
    marginBottom: 10
  },
  mainContainer:{
    flexDirection:"column",
    justifyContent:"flex-start",
    width:"90%",
    backgroundColor:"#6A4035",
    borderRadius:10
  },
  personContainer: {
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
    color:"white",
  },
  horizontalLine:{
    marginLeft: 17,
    marginRight: 17,
    width: "auto",
    borderWidth: 0.6,
    borderColor: "#E5B47F",
  },

  textBox: {
    marginLeft: 18,
    marginRight: 18,
    marginTop: 10,
    marginBottom: 10
  },
  text:{
    fontSize: 18,
    fontFamily: "noto-reg",
    lineHeight: 25,
    color:"white"
  }
});
