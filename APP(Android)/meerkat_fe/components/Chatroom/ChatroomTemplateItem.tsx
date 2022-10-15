import AsyncStorage, { AsyncStorageStatic } from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { MaterialIcons, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";

interface TemplateItem {
  id: number,
  name: string,
  content: string
}

interface TemplateItemProps {
  item: TemplateItem
  onApply: () => void
  scrollTo: (item: any) => void
  updateItem: (id: number, name: string, content: string) => void
  removeItem: (id: number) => void
}

const TemplateItem = (props: TemplateItemProps) => {
  const { item } = props;
  const [editVisible, setEditVisible] = useState(false)
  const nameInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  const [name, setName] = useState(item.name);
  const [content, setContent] = useState(item.content);

  return (
    <View style={styles.item}>
      <TextInput
        ref={nameInputRef}
        style={styles.itemName}
        value={name}
        onPressIn={() => props.scrollTo(nameInputRef?.current)}
        onChangeText={setName}
        onBlur={() => props.updateItem(item.id, name, content)}
      />
      <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingTop: 8 }}>
        <TouchableOpacity onPress={() => {}}>
         <Ionicons name="md-save-outline" size={32} color='#6A4035' style={{marginRight: 10}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.removeItem(item.id)}>
          <MaterialIcons size={32} name='remove' color='#6A4035' style={{marginRight: 10}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditVisible(!editVisible)}>
          <MaterialCommunityIcons size={32} name='pencil-outline' color='#6A4035' style={{marginRight: 10}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onApply}>
          <MaterialIcons size={32} name='check' color='#6A4035' style={{marginRight: 10}} />
        </TouchableOpacity>
      </View>
      {editVisible && <TextInput
        ref={contentInputRef}
        style={{ backgroundColor: "#6A4035", padding: 8, borderRadius: 8 ,color: "white"}}
        value={content}
        multiline
        onPressIn={() => props.scrollTo(contentInputRef?.current)}
        onChangeText={setContent}
        onBlur={() => props.updateItem(item.id, name, content)}
      />}
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    borderRadius: 12,
    width: "100%",
    padding: 12,
    marginTop: 12,
    backgroundColor: "#E5B47F"
  },
  itemName: {
    backgroundColor: "#E5B47F",
    borderRadius: 4,
    fontSize: 28,
    color: "#6A4035",
    fontFamily: "noto-bold",
    lineHeight: 50,
    borderBottomWidth:  2,
    borderBottomColor: "white"
  }
})
// #E5B47F #6A4035


export default TemplateItem;
