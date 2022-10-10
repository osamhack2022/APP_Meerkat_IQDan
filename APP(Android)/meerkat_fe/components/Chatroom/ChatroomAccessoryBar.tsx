import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IMessage } from 'react-native-gifted-chat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const pickImageAsync = async (onSend: (messages: IMessage[]) => void) => {
  if (await ImagePicker.requestMediaLibraryPermissionsAsync()) {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      onSend([
        {
          _id: -1,
          text: '',
          createdAt: Date.now(),
          user: { _id: -1 },
          image: result.uri,
        },
      ]);
      return result.uri;
    }
  }
};

interface ChatroomAccessoryBarProps {
  onSend: (messages: IMessage[]) => void;
  onPressSuperiorSwitch: () => void;
  onPressTemplate: () => void;
  superiorOnly: boolean;
}

const ChatroomAccessoryBar = (props: ChatroomAccessoryBarProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => props.onPressTemplate()}
      >
        <MaterialCommunityIcons name="lightning-bolt" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => pickImageAsync(props.onSend)}
      >
        <MaterialIcons size={24} color="black" name="photo" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={props.onPressSuperiorSwitch}
      >
        {props.superiorOnly ? (
          <AntDesign name="pushpin" size={24} color="black" />
          ) : (
          <AntDesign name="pushpino" size={24} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderTopColor: 'rgba(0,0,0,0.3)',
    // paddingTop: 8
  },
  item: {
    backgroundColor: '#EEE',
    padding: 6,
    borderRadius: 4,
  },
});

export default ChatroomAccessoryBar;
