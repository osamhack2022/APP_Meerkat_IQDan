import { Alert } from "react-native";
import { Socket } from "socket.io-client";
import { Chatroom } from "./types";
import api from "./api";

// 일단 roomsocket에 작성하는 건 보류. paramter가 하나 더 붙어야 함.
/*
// set all of room socket events in this function
export function roomSocketFunction(socket: Socket) {
    socket.on('connect', () => {
      // DEBUG : console log는 socket 디버깅용, 추후 완성되면 삭제
      console.log('--------------- room socket ---------------');
      
      // 재접속 시 DB에서 속해있는 모든 방의 정보를 가져온 후, 그 방에 전부 접속해야 함.

    });


    

    ////////////////////////// DEBUG: just for debug

    //////////////////////////
  
    socket.on("disconnect", () => {
      console.log('--------------- room disconnected ---------------');
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
  }
  */