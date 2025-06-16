import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useToast } from "../contexts/ToastContext";
import useAuth from "../hooks/useAuth";

const MessageHandler = ({ refreshMessages }) => {
  const socketRef = useSocket();
  const { showToast } = useToast();
  const { userID, isLoading } = useAuth();

  useEffect(() => {
    // Nếu đang loading, chưa có userID hoặc chưa có socket thì không xử lý
    if (isLoading || !userID || !socketRef?.current) return;

    const socket = socketRef.current;

    const handleNewMessage = (data) => {
      if (data.senderId !== userID) {
        showToast(`Tin nhắn mới từ ${data.senderName}: ${data.content}`);
        // Refresh messages to show the new message
        if (refreshMessages) {
          refreshMessages();
        }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socketRef, userID, showToast, isLoading, refreshMessages]);

  return null;
};

export default MessageHandler;
