import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import { UserEvent, UserProfile } from "../../common/types.d";

function getEventImage(event: UserEvent | null){
    if(event == UserEvent.NONE || event == null){
        return <></>
    }

    var eventImageSource;
    if(event == UserEvent.RESERVE){
        eventImageSource = require('../../assets/user_event/be_reserved.jpg');
    }
    else if(event == UserEvent.PROMOTION){
        eventImageSource = require('../../assets/user_event/be_promotion.jpg');
    }
    return eventImageSource;
}

export default function FriendBox(props: UserProfile) {
  const { name, image, event, statusMessage } = props;

  const ProfileImageSource = image == null
                                ? require('../../assets/user_event/empty_profile.jpg')
                                : require(image);
  const EventImageSource = getEventImage(event);

  return (
    <View style={styles.container}>
        <Image style={styles.profileImage} source={ProfileImageSource} /> 
        <View style={styles.mainContainer}>
            <View style={styles.nameLayout}>
                <Text style={styles.nameText}>
                    {name}
                </Text>
                <Image style={styles.eventImage} source={EventImageSource} /> 
            </View>
            <Text style={styles.statusMessageText}>
                {statusMessage}
            </Text>
        </View>
        <View style={styles.ddayContainer}>
            <Text style={styles.ddayText}>
                D-100
            </Text>
        </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        height: 65,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        backgroundColor: "white"
    },
    profileImage:{
        width: 46,
        height: 46,
        borderRadius: 17,
        marginLeft: 18,
        marginRight: 12
    },
    mainContainer: {
        flexDirection: "column"
    },
    nameLayout:{
        flexDirection: "row",
        alignItems: "center",
    },
    nameText:{
        fontSize: 19,
        fontFamily: "noto-reg",
        lineHeight: 20
    },
    eventImage:{
        marginLeft: 6,
        width: 15,
        height: 15
    },
    statusMessageText:{
        marginTop: 3,
        fontSize: 11,
        color: "rgba(0, 0, 0, 0.45)"
    },
    ddayContainer:{
        position: "absolute",
        borderRadius: 4,
        padding: 4,
        right: 18,
        backgroundColor: "#D6D6D6"
    },
    ddayText:{
        fontSize: 12,
        textAlign: "center",
        textAlignVertical: "center"
    }


})



