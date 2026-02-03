import { io } from "socket.io-client";
import { SOCKET_URL } from "../constants";

const socket = io(SOCKET_URL, {
    transports: ["websocket"],
});

socket.on("connect", () => {});

export default socket;
