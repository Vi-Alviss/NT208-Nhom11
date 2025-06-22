import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

const SocketContext = createContext(null);
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3002";

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    return null;
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { userID, isLoading } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (socketRef.current || !userID || isLoading) return;

    const connectSocket = () => {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: {
          token: localStorage.getItem("token"),
        },
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
        reconnectAttempts.current = 0;
        socketRef.current.emit("userOnline", userID);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
        reconnectAttempts.current += 1;

        if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.error("Max reconnection attempts reached");
          if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
          }
        }
      });
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [userID, isLoading]);

  return (
    <SocketContext.Provider value={{ socket: socketRef, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
