import AsyncStorage, { AsyncStorageStatic } from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
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
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons size={40} name='save' />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.removeItem(item.id)}>
          <MaterialIcons size={40} name='remove' />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditVisible(!editVisible)}>
          <MaterialIcons size={40} name='edit' />
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onApply}>
          <MaterialIcons size={40} name='check' />
        </TouchableOpacity>
      </View>
      {editVisible && <TextInput
        ref={contentInputRef}
        style={{ backgroundColor: "#EEE", padding: 8, borderRadius: 8 }}
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
    backgroundColor: "#AAAAAA88"
  },
  itemName: {
    backgroundColor: "#EEE",
    borderRadius: 4,
    fontSize: 32,
  }
})

export default TemplateItem;
