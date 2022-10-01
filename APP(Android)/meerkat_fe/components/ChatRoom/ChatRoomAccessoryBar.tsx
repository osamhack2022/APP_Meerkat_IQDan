import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { IMessage } from 'react-native-gifted-chat';

const pickImageAsync = async (onSend: (messages: IMessage[]) => void) => {
  if (await ImagePicker.requestMediaLibraryPermissionsAsync()) {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    })

    if (!result.cancelled) {
      onSend([{ _id: -1, text: "", createdAt: Date.now(), user: {_id: -1},  image: result.uri }])
      return result.uri
    }
  }
}

const ChatRoomAccessoryBar = (props: {onSend: (messages: IMessage[]) => void}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => pickImageAsync(props.onSend)}>
        <MaterialIcons size={30} color="#000000" name='photo' />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.3)',
  },
})

export default ChatRoomAccessoryBar;
