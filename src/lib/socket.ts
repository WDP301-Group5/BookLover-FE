import { io } from "socket.io-client";
import { SOCKET_URL } from "../constants";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

export default socket;
