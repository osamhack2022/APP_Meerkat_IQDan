import React, { useRef, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";

interface ChatRoomTemplateModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  setMsgInput: (msg: string) => void
}

interface TemplateItem {
  _id: number,
  name: string,
  content: string
}

const templateList: TemplateItem[] = [
  {_id: 1, name: "휴가 출발", content: "충성!\n상병 전형록 휴가 (0.0 ~ 0.0) 출발하여 YY에 도착하였습니다!"},
  {_id: 2, name: "휴가 복귀", content: "충성!\n상병 전형록 휴가 (0.0 ~ 0.0) 복귀 후 지통실에 보고하였습니다!"},
  {_id: 3, name: "인원 보고", content: "충성!\n9생활관 총원 9명 이상없습니다."},
  {_id: 4, name: "이상무", content: "충성! 순찰 이상없습니다."},
  {_id: 5, name: "이상무", content: "충성! 순찰 이상없습니다."},
  {_id: 6, name: "이상무", content: "충성! 순찰 이상없습니다."},
  {_id: 7, name: "이상무", content: "충성! 순찰 이상없습니다."},
  {_id: 8, name: "이상무", content: "충성! 순찰 이상없습니다."},
  {_id: 9, name: "이상무", content: "충성! 순찰 이상없습니다."},
]

const TemplateItem = (props: {item: TemplateItem, onApply: () => void, scrollTo: (item: any) => void}) => {
  const [editVisible, setEditVisible] = useState(false)
  const nameInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.item}>
      <TextInput 
        ref={nameInputRef}
        style={styles.itemName}
        value={props.item.name}
        onPressIn={() => props.scrollTo(nameInputRef?.current)}
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
        value={props.item.content}
        multiline
        onPressIn={() => props.scrollTo(contentInputRef?.current)}
      />}
    </View>
  )
}

const ChatRoomTemplatePanel = (props: ChatRoomTemplateModalProps) => {
  let scrollRef = useRef<ScrollView>(null)  
  
  const scrollToItem = (item: TextInput) => {
    let responder = scrollRef.current?.getScrollResponder()
    setTimeout(() => {
      responder?.scrollResponderScrollNativeHandleToKeyboard(item, 200, true)
    }, 150)
  }

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
                templateList.map((item) =>
                  <TemplateItem
                    onApply={() => { props.setMsgInput(item.content); props.setVisible(false) }}
                    scrollTo={scrollToItem}
                    item={item}
                    key={item._id}
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
