import { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import Spinner from "./Spinner";
import { FaArrowDown } from "react-icons/fa";

function MessageComponent({
  conversationID,
  socket,
  messages,
  loading,
  error,
  setMessages,
  avatarURL,
  conversationName,
}) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    if (!containerRef.current) return;

    setTimeout(() => {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setShowScrollButton(false);
    }, 100);
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket?.socket?.current || !conversationID) return;

    const currentSocket = socket.socket.current;

    currentSocket.emit("joinConversation", conversationID);

    const handleReceiveMessage = (newMessage) => {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(
          (msg) => msg.id === newMessage.id
        );
        if (messageExists) return prevMessages;

        return [...prevMessages, newMessage];
      });
      scrollToBottom();
    };

    currentSocket.on("receiveMessage", handleReceiveMessage);

    return () => {
      currentSocket.off("receiveMessage", handleReceiveMessage);
    };
  }, [conversationID, socket, setMessages]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col h-full">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        {loading && <Spinner />}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessageItem
              key={message.id || message.MessageID || index}
              message={message}
              avatarURL={avatarURL}
              conversationName={conversationName}
            />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-4 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
          title="Cuộn xuống"
        >
          <FaArrowDown />
        </button>
      )}
    </div>
  );
}

export default MessageComponent;
