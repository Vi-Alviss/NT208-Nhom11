import { timeFromNow, formatTime } from "../utils/dayjs";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";

const MessageItem = ({ message, avatarURL, conversationName }) => {
  const { userID, isLoading } = useAuth();
  const isCurrentUser = message.senderid === userID;

  if (isLoading) return <Spinner />;

  return (
    <div
      className={`flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      } mb-4 px-4 lg:px-8`}
    >
      {/* Container tin nhắn */}
      <div
        className={`flex items-start max-w-xs sm:max-w-sm lg:max-w-md gap-3 ${
          isCurrentUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar (ẩn với tin nhắn của current user) */}
        {!isCurrentUser && (
          <div className="mt-4 w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden flex-shrink-0">
            {avatarURL ? (
              <img
                src={avatarURL}
                alt={"Ảnh đại diện"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none"; // Hide broken image
                  e.target.nextSibling.style.display = "flex"; // Show fallback
                }}
              />
            ) : (
              <span className="flex items-center justify-center w-full h-full">
                {conversationName?.charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>
        )}

        {/* Nội dung tin nhắn */}
        <div className="flex flex-col mt-4">
          {/* Bubble tin nhắn */}
          <div
            className={`px-4 py-2 rounded-2xl shadow-sm ${
              isCurrentUser
                ? "bg-Primary text-white rounded-tr-none"
                : "bg-gray-100 text-gray-800 rounded-tl-none"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>

          {/* Thời gian */}
          <div
            className={`text-xs mt-1.5 ${
              isCurrentUser
                ? "text-right text-gray-500"
                : "text-left text-gray-500"
            }`}
          >
            {timeFromNow(message.createdat)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
