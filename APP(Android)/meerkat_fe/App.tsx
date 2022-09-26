import { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import ChatRoomList from "./pages/ChatRoomList";

export default function App() {
  const [fontsLoaded] = useFonts({
    "noto-black": require("./assets/fonts/NotoSansKR-Black.otf"),
    "noto-bold": require("./assets/fonts/NotoSansKR-Bold.otf"),
    "noto-light": require("./assets/fonts/NotoSansKR-Light.otf"),
    "noto-med": require("./assets/fonts/NotoSansKR-Medium.otf"),
    "noto-reg": require("./assets/fonts/NotoSansKR-Regular.otf"),
    "noto-thin": require("./assets/fonts/NotoSansKR-Thin.otf"),
  });

  return (
    <>
      {fontsLoaded && <ChatRoomList />}
    </>
  );
}
