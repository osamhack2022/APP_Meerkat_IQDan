import AsyncStorage, { AsyncStorageStatic } from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { MaterialIcons, Ionicons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons'
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
      <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingTop: 8, paddingBottom: 6 }}>
        <TouchableOpacity onPress={() => {}}>
         <Ionicons name="md-save-outline" size={32} color='#FFF9D2' style={{marginRight: 10}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.removeItem(item.id)}>
          <FontAwesome name="trash-o" size={32} color="#FFF9D2" style={{marginRight: 10}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditVisible(!editVisible)}>
          <MaterialCommunityIcons size={32} name='pencil-outline' color='#FFF9D2' style={{marginRight: 10}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onApply}>
          <MaterialIcons size={32} name='check' color='#FFF9D2' style={{marginRight: 10}} />
        </TouchableOpacity>
      </View>
      {editVisible && <TextInput
        ref={contentInputRef}
        style={{ backgroundColor: "#FFF9D2", padding: 8, borderRadius: 8, color: "#6A4035", marginTop: 3, marginBottom: 8}}
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
    paddingLeft:12,
    paddingRight:12,
    marginTop: 12,
    backgroundColor: "#6A4035"
  },
  itemName: {
    borderRadius: 4,
    fontSize: 20,
    color: "#FFF9D2",
    fontFamily: "noto-bold",
    lineHeight: 30,
    borderBottomWidth:  2,
    borderBottomColor: "#FFF9D2",
    height: 50
  }
})
// #E5B47F #6A4035 #FFF9D2


export default TemplateItem;
