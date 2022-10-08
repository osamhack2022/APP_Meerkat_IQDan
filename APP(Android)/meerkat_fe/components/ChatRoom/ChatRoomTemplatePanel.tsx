import AsyncStorage, { AsyncStorageStatic } from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import TemplateItem from "./ChatRoomTemplateItem";

const TemplateStorageKey = "TemplateStorageKey"

interface ChatRoomTemplateModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  setMsgInput: (msg: string) => void
}

const defaultTemplateList: TemplateItem[] = [
  {id: 1, name: "휴가 출발", content: "충성!\n상병 전형록 휴가 (0.0 ~ 0.0) 출발하여 YY에 도착하였습니다!"},
  {id: 2, name: "휴가 복귀", content: "충성!\n상병 전형록 휴가 (0.0 ~ 0.0) 복귀 후 지통실에 보고하였습니다!"},
  {id: 3, name: "인원 보고", content: "충성!\n9생활관 총원 9명 이상없습니다."},
]

const ChatRoomTemplatePanel = (props: ChatRoomTemplateModalProps) => {
  let scrollRef = useRef<ScrollView>(null)  
  let [templates, settempaltes] = useState<TemplateItem[]>([]);
  
  const scrollToItem = (item: TextInput) => {
    let responder = scrollRef.current?.getScrollResponder()
    setTimeout(() => {
      responder?.scrollResponderScrollNativeHandleToKeyboard(item, 200, true)
    }, 150)
  }

  const updateStorage = async (templates: TemplateItem[]) => {
    AsyncStorage.setItem(TemplateStorageKey, JSON.stringify(templates));
  }

  const updateItem = (id: number, name: string, content: string) => {
    let t = templates.filter((item) => item.id != id);
    t.push({id, name, content});
    t = t.sort((x, y) => x.id - y.id);
    settempaltes(t);
    updateStorage(t);
  }

  const addItem = () => {
    let maxId = templates ? templates[templates.length-1].id : 0;
    let t = [...templates, {id: maxId+1, name: "", content: ""}];
    settempaltes(t);
    updateStorage(t);
  }

  const removeItem = (id: number) => {
    let t = templates.filter((item) => item.id != id);
    settempaltes(t);
    updateStorage(t);
  }

  useEffect(() => {
    let getData = async () => {
      let res = await AsyncStorage.getItem(TemplateStorageKey)
      if (res) {
        settempaltes(JSON.parse(res));
      } 
      else {
        settempaltes(defaultTemplateList); 
      }
    }
    getData();
  }, []);

  if (!props.visible) return null;

  return (
    <SafeAreaView style={{ flex: 1, position: "absolute", width: "100%", height: "100%", backgroundColor: "#FFF" }}>
      <KeyboardAvoidingView behavior="padding">
        <View style={{ flexDirection: "row", width: "100%", justifyContent: "flex-end", paddingRight: 24}}>
          <Pressable onPress={() => addItem()}>
            <MaterialIcons size={48} name="add" />
          </Pressable>
          <Pressable onPress={() => props.setVisible(false)}>
            <MaterialIcons size={48} name="close" />
          </Pressable>
        </View>
        <ScrollView ref={scrollRef} style={{height: "100%", backgroundColor: "#EEE"}}>
          <View style={{ alignItems: "center", height: "100%", marginHorizontal: 24, paddingBottom: "10%" }}>
            <View style={styles.itemList}>
              {
                templates.map((item) =>
                  <TemplateItem
                    onApply={() => { props.setMsgInput(item.content); props.setVisible(false) }}
                    scrollTo={scrollToItem}
                    item={item}
                    key={item.id}
                    updateItem={updateItem}  
                    removeItem={removeItem}
                  />)
              }
            </View >
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  itemList: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: "100%"
  }
});

export default ChatRoomTemplatePanel;
