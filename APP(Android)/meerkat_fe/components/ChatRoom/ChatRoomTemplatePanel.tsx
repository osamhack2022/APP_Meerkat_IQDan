import AsyncStorage, { AsyncStorageStatic } from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";

const TemplateStorageKey = "TemplateStorageKey"

interface ChatRoomTemplateModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  setMsgInput: (msg: string) => void
}

interface TemplateItem {
  id: number,
  name: string,
  content: string
}

const defaultTemplateList: TemplateItem[] = [
  {id: 1, name: "휴가 출발", content: "충성!\n상병 전형록 휴가 (0.0 ~ 0.0) 출발하여 YY에 도착하였습니다!"},
  {id: 2, name: "휴가 복귀", content: "충성!\n상병 전형록 휴가 (0.0 ~ 0.0) 복귀 후 지통실에 보고하였습니다!"},
  {id: 3, name: "인원 보고", content: "충성!\n9생활관 총원 9명 이상없습니다."},
]

interface TemplateItemProps {
  item: TemplateItem
  onApply: () => void
  scrollTo: (item: any) => void
  updateItem: (id: number, name: string, content: string) => void
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
      <View style={{flexDirection: "row", justifyContent: "flex-end"  }}>
        <TouchableOpacity onPress={() => setEditVisible(!editVisible)}>
          <MaterialIcons size={40} name='edit'/>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onApply}>
          <MaterialIcons size={40} name='check'/>
        </TouchableOpacity>
      </View>
      {editVisible && <TextInput 
        ref={contentInputRef}
        style={{backgroundColor: "#EEE", padding: 8, borderRadius: 8}}
        value={content}
        multiline
        onPressIn={() => props.scrollTo(contentInputRef?.current)}
        onChangeText={setContent}
        onBlur={() => props.updateItem(item.id, name, content)}
      />}
    </View>
  )
}

const ChatRoomTemplatePanel = (props: ChatRoomTemplateModalProps) => {
  let scrollRef = useRef<ScrollView>(null)  
  let [templates, settempaltes] = useState<TemplateItem[]>([]);
  
  const scrollToItem = (item: TextInput) => {
    let responder = scrollRef.current?.getScrollResponder()
    setTimeout(() => {
      responder?.scrollResponderScrollNativeHandleToKeyboard(item, 200, true)
    }, 150)
  }

  const updateItem = (id: number, name: string, content: string) => {
    let t = templates.filter((item) => item.id != id);
    t.push({id, name, content});
    t = t.sort((x, y) => x.id - y.id);
    settempaltes(t);
    (async () => {
      AsyncStorage.setItem(TemplateStorageKey, JSON.stringify(t));
    })();
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
        <ScrollView ref={scrollRef}>
          <View style={{ alignItems: "center", height: "100%", marginHorizontal: 24, paddingBottom: "10%" }}>
            <Pressable style={{ alignSelf: "flex-end" }} onPress={() => props.setVisible(false)}>
              <MaterialIcons size={48} name="close" />
            </Pressable>
            <View style={styles.itemList}>
              {
                templates.map((item) =>
                  <TemplateItem
                    onApply={() => { props.setMsgInput(item.content); props.setVisible(false) }}
                    scrollTo={scrollToItem}
                    item={item}
                    key={item.id}
                    updateItem={updateItem}  
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