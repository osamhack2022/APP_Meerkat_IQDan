import { Alert } from "react-native";
import { io, Socket } from "socket.io-client";

import { Chatroom } from "./types";
import api from "./api";



// set all of global socket events in this function
export const globalSocketFunction = (socket: Socket) => {
  socket.connect();
    socket.on('connect', () => {
      // DEBUG : console log는 socket 디버깅용, 추후 완성되면 삭제
      console.log('--------------- global socket ---------------');
      
      // 재접속 시 DB에서 속해있는 모든 방의 정보를 가져온 후, 그 방에 전부 접속해야 함.
      // connectBelongRooms(socket);
    });
  
    socket.on("disconnect", () => {
      // DEBUG : console log는 socket 디버깅용, 추후 완성되면 삭제
      console.log('--------------- global disconnected ---------------');
    });
  
    // if connection error occurs, then use polling first
    socket.on('connect_error', err => {
      // DEBUG : console log는 socket 디버깅용, 추후 완성되면 삭제
      console.log('connection error : ' + err.message);
    });
  
    socket.io.on('error', error => {
      //console.log('socket connect error: ' + error);
    });
  
    socket.io.on('reconnect', attempt => {
      // DEBUG : console log는 socket 디버깅용, 추후 완성되면 삭제
      console.log(attempt + '만에 재시도 성공');
    });
  
    socket.io.on('reconnect_attempt', attempt => {
      // DEBUG : console log는 socket 디버깅용, 추후 완성되면 삭제
      console.log('재시도 횟수 : ' + attempt + socket.auth);
    });
  
    socket.io.on('reconnect_error', error => {
      // DEBUG : console log는 socket 디버깅용, 추후 완성되면 삭제
      console.log('재연결 시도 실패: ' + error);
    });
  
    socket.io.on('reconnect_failed', () => {
      // DEBUG : console log는 socket 디버깅용, 추후 완성되면 삭제
      console.log('socket reconnect faile ');
    });
  }
  

  export function connectBelongRooms(socket:Socket){
    api.get('/chatroom/my')
    .then((res) => {
      const chatrooms:Chatroom[] = res.data.data;
      const chatroomIds:number[] = chatrooms.map(chatroom=>chatroom.chatroomId);
      socket.emit("client:joinAllChatrooms", chatroomIds);
    })
    .catch((err)=>{
      Alert.alert("네트워크 접속 오류입니다.")
    });
  }