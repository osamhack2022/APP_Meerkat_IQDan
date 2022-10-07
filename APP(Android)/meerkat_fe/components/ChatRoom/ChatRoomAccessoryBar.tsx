import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { IMessage } from 'react-native-gifted-chat';
import { Switch } from 'react-native-gesture-handler';

const ICON_COLOR = "#444";

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

interface ChatRoomAccessoryBarProps {
  onSend: (messages: IMessage[]) => void,
  onPressSuperiorSwitch: () => void
  onPressTemplate: () => void
  superiorOnly: boolean,
}

const ChatRoomAccessoryBar = (props: ChatRoomAccessoryBarProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={() => {}}>
        <MaterialIcons size={30} color={ICON_COLOR} name='calendar-today' />
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => props.onPressTemplate()}>
        <MaterialIcons size={30} color={ICON_COLOR} name='article' />
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => pickImageAsync(props.onSend)}>
        <MaterialIcons size={30} color={ICON_COLOR} name='photo' />
      </TouchableOpacity>
      <View>
        <Switch value={props.superiorOnly} onValueChange={props.onPressSuperiorSwitch} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.3)',
    paddingTop: 8
  },
  item: {
    backgroundColor: "#EEE",
    padding: 6,
    borderRadius: 4,
  }
})

export default ChatRoomAccessoryBar;
