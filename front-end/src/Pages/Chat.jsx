import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";

// Single socket instance
const socket = io("https://real-time-team-platform.vercel.app/", {
  withCredentials: true,
});

const Chat = ({ projectId, teamId }) => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!projectId && !teamId) return;

    const fetchMessages = async () => {
      try {
        let url = `http://localhost:4000/api/chat/messages?`;
        if (projectId) url += `projectId=${projectId}`;
        else if (teamId) url += `teamId=${teamId}`;

        const res = await axios.get(url, { withCredentials: true });
        setMessages(
          res.data.messages.map((msg) => ({
            sender: msg.sender.name,
            message: msg.content,
            timestamp: msg.timestamp,
          })),
        );
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();

    if (projectId) socket.emit("joinProject", projectId);
    if (teamId) socket.emit("joinTeam", teamId);

    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));

    return () => socket.off("receiveMessage");
  }, [projectId, teamId]);

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    const msg = {
      sender: { _id: user._id, name: user.name },
      message: newMessage,
      timestamp: new Date(),
    };

    // Emit to socket
    socket.emit("sendMessage", {
      projectId,
      teamId,
      message: newMessage,
      senderId: user._id,
    });

    // Save to backend
    try {
      await axios.post(
        `http://localhost:4000/api/chat/messages`,
        { content: newMessage, projectId, teamId },
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Failed to save message:", err);
    }

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  if (!user) return <p className="p-6 text-gray-500">Loading user...</p>;

  return (
    <div className="flex flex-col h-full border rounded-lg shadow bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender?.name === user.name ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${msg.sender?.name === user.name ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              <div className="text-sm font-semibold">{msg.sender?.name}</div>
              <div className="mt-1">{msg.message}</div>
              <div className="text-xs text-gray-400 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t flex space-x-2 bg-gray-50">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
