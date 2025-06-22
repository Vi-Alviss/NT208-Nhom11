import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FaInfoCircle } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";

import DefaultNavbar from "../components/DefaultNavbar";
import MessageComponent from "../components/MessageComponent";
import MessageInput from "../components/MessageInput";
import useAuth from "../hooks/useAuth";

import { useSocket } from "../contexts/SocketContext";
import useConversations from "../hooks/useConversations";
import useMessages from "../hooks/useMessages";
import useDeleteConversation from "../hooks/useDeleteConversation";

import { timeFromNow, formatTime } from "../utils/dayjs";

const Message = ({ onLogout }) => {
  const { deleteConversation, deleteLoading, deleteError } =
    useDeleteConversation();

  // conversation
  const { userID, isLoading } = useAuth();
  const { id } = useParams(); // id = conversationID trên URL
  const [conversationID, setConversationID] = useState(id ? Number(id) : null);
  const [showConversations] = useState(true);
  const {
    conversations,
    conversationLoading,
    conversationError,
    conversationRefresh,
  } = useConversations(showConversations);

  // messages
  const {
    messages,
    messagesLoading,
    messagesError,
    refreshMessages,
    setMessages,
  } = useMessages(conversationID);

  const navigate = useNavigate();

  // khởi tạo socket
  const socketRef = useSocket();

  // lấy cuộc hội thoại đang chọn
  const selectedConversation = conversations?.find(
    (conv) => conv.conversationid === conversationID
  );

  console.log(selectedConversation);

  // Xử lý xem trang cá nhân
  const handleViewProfile = () => {
    if (selectedConversation) {
      // Nếu người gửi tin nhắn cuối là người dùng hiện tại, lấy ID của người còn lại
      const otherUserId =
        selectedConversation.user1_id === userID
          ? selectedConversation.user2_id
          : selectedConversation.user1_id;

      navigate(`/users/${otherUserId}`);
    }
  };

  // xóa cuộc hội thoại
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xoá cuộc hội thoại này?"
    );
    if (!confirmed) return;

    const result = await deleteConversation(conversationID);
    if (result) {
      conversationRefresh();
      navigate("/messages"); // Chuyển về trang messages sau khi xóa
    }
  };

  console.log("selected Conversation +++", selectedConversation);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <DefaultNavbar className="flex-shrink-0" onLogout={onLogout} />

      <div className="flex flex-1 overflow-hidden">
        {/* Conversation bên phải */}
        <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto pt-16">
            {conversationLoading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : conversationError ? (
              <div className="text-red-500 p-4 text-center">
                {conversationError}
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-gray-500 p-4 text-center">
                Không có cuộc trò chuyện nào
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.conversationid}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    conversationID === conversation.conversationid
                      ? "bg-gray-100"
                      : ""
                  }`}
                  onClick={() => setConversationID(conversation.conversationid)}
                >
                  <div className="flex items-start gap-3">
                    {/* TODO: nhớ thêm avatar */}
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                        {conversation.avatarurl ? (
                          <img
                            src={conversation.avatarurl}
                            alt={
                              conversation.conversationname || "Ảnh đại diện"
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {conversation.conversationname
                              ?.charAt(0)
                              .toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="conversation-name font-medium text-gray-900 truncate max-w-[180px]">
                          {/* Tên cuộc hội thoại */}
                          {conversation.conversationname}
                        </div>
                        <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                          {timeFromNow(conversation.lastmessagetime)}
                        </div>
                      </div>
                      {/* Tin nhắn gần đây nhất */}
                      <div className="conversation-last-message text-sm text-gray-500 mt-1 truncate">
                        <span>
                          {conversation.senderid === userID ? "Bạn: " : ""}
                        </span>
                        {conversation.lastmessage}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Khung chat */}
        <div className="mt-16 flex-1 flex flex-col bg-white">
          {/* Tiêu đề */}
          {selectedConversation ? (
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                  {selectedConversation.avatarurl ? (
                    <img
                      src={selectedConversation.avatarurl}
                      alt={
                        selectedConversation.conversationname || "Ảnh đại diện"
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {selectedConversation.conversationname
                        ?.charAt(0)
                        .toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedConversation.conversationname || "Người dùng"}
                </h2>
              </div>
              <div className="flex items-center">
                <MdDeleteSweep
                  className="text-2xl text-red-500 cursor-pointer hover:text-red-300 mr-4"
                  onClick={handleDelete}
                />
                <FaInfoCircle
                  className="text-2xl text-darkPrimary cursor-pointer hover:text-lightPrimary mr-4"
                  onClick={handleViewProfile}
                />
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
              <p className="text-gray-500">
                Chọn một cuộc trò chuyện để bắt đầu
              </p>
            </div>
          )}

          {/* khung tin nhắn */}
          <div className="flex-1 overflow-hidden">
            {selectedConversation ? (
              <MessageComponent
                conversationID={conversationID}
                socket={socketRef}
                messages={messages}
                loading={messagesLoading}
                error={messagesError}
                refreshMessages={refreshMessages}
                setMessages={setMessages}
                avatarURL={selectedConversation.avatarurl || ""}
                conversationName={selectedConversation.conversationname || ""}
              />
            ) : null}
          </div>

          {/* Nhập tin nhắn */}
          {selectedConversation && (
            <div className="flex-shrink-0">
              <MessageInput
                conversationID={conversationID}
                socket={socketRef}
                refreshMessages={refreshMessages}
                setMessages={setMessages}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
