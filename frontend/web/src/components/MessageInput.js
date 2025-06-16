import { IoDocumentAttachOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { useState } from "react";
import { sendMessage } from "../api/messages";

const MessageInput = ({
  conversationID,
  socket,
  setMessages,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessages = async () => {
    if (!inputMessage.trim() || !conversationID || isSending) return;

    try {
      setIsSending(true);
      const newMessage = await sendMessage(conversationID, inputMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (socket?.socket?.current) {
        socket.socket.current.emit("sendMessage", {
          conversationID,
          content: inputMessage,
          messageID: newMessage.id,
        });
      }

      setInputMessage("");
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      alert(error.message || "Không thể gửi tin nhắn");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessages();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-center space-x-2">
        <button className="text-gray-500 hover:text-gray-700">
          <IoDocumentAttachOutline className="text-2xl" />
        </button>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary resize-none"
          rows="1"
          disabled={isSending}
        />
        <button
          onClick={handleSendMessages}
          disabled={!inputMessage.trim() || isSending}
          className={`p-2 rounded-full ${
            !inputMessage.trim() || isSending
              ? "text-gray-400 cursor-not-allowed"
              : "text-primary hover:text-primary-dark"
          }`}
        >
          <IoIosSend className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
