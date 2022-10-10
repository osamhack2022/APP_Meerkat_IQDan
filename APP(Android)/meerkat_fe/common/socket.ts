import { Alert } from "react-native";
import { io, Socket } from "socket.io-client";
import env from "../env.json";
import { Chatroom } from "../common/types";
import api from "./api";

export function getEmptySocketIO(): Socket {
    return io(env.dev.apiBaseUrl, {
      path: '/socket.io',
      transports: ['websocket'],
      reconnectionAttempts: 0,
      autoConnect: false
    });
  }
  
  interface MessageDto {
    userId: number;
    content: string;
    // TODO : 사진 들어갈수도. type을 추가해서 처리하면 될듯.
    roomId: number;
  }

// set all of socketio events in this function
export function attachSocket(socket: Socket) {
    socket.on('connect', () => {
      // TODO : console log는 socket 디버깅용, 추후 완성되면 삭제
      console.log('--------------- socket ---------------');
      
      // 재접속 시 DB에서 속해있는 모든 방의 정보를 가져온 후, 그 방에 전부 접속해야 함.
      api.get('/chatroom/my')
      .then((res) => {
        const chatrooms:Chatroom[] = res.data.data;
        const chatroomIds:number[] = chatrooms.map(chatroom=>chatroom.chatroomId);
        console.log(chatroomIds);
        socket.emit("connectionJoinRoom", chatroomIds);
      })
      .catch((err)=>{
        Alert.alert("네트워크 접속 오류입니다.")
      });
    });

    // emit

    

    ////////////////////////// DEBUG: just for debug
    // 방에 접속한 목록 출력
    socket.on("connectionJoinRoomDebug", msg =>{
      console.log(msg);
    })

    socket.on("testsendmessage", (message:string) => {
      console.log(message);
    });
    //////////////////////////
  
    socket.on("disconnect", () => {
      console.log('--------------- disconnected ---------------' + socket.id);
    });
  
    // if connection error occurs, then use polling first
    socket.on('connect_error', err => {
      // TODO : console log는 socket 디버깅용, 추후 완성되면 삭제
      console.log('connection error : ' + err.message);
    });
  
    socket.io.on('error', error => {
      console.log('socket connect error: ' + error);
    });
  
    socket.io.on('reconnect', attempt => {
      console.log(attempt + '만에 재시도 성공');
    });
  
    socket.io.on('reconnect_attempt', attempt => {
      console.log('재시도 횟수 : ' + attempt + socket.auth);
    });
  
    socket.io.on('reconnect_error', error => {
      console.log('재연결 시도 실패: ' + error);
    });
  
    socket.io.on('reconnect_failed', () => {
      console.log('socket reconnect faile ');
    });
  
    // TODO : client 단에서는 volatile 쓰면 안됨. + if(socket.connected)일 때 socket.emit() 하는 것으로.
    // ex)
    // let count = 0;
    // setInterval(() => {
    //     if(socket.connected){
    //         socket.timeout(5000).emit('testsend', ++count);
    //     }
    // }, 2000);
  }
  