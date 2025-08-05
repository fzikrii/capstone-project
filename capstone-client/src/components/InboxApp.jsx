import React, { useState } from "react";

// Initial list of users with their latest message and message time
const initialUsers = [
  {
    id: 1,
    name: "Fadila",
    lastMessage: "Has it been submitted?",
    time: "10:30",
  },
  {
    id: 2,
    name: "Elmira",
    lastMessage: "Thank you!",
    time: "11:45",
  },
  {
    id: 3,
    name: "Emmy",
    lastMessage: "There's a meeting this afternoon",
    time: "13:20",
  },
];

const InboxApp = () => {
  // Currently selected user from the list
  const [selectedUser, setSelectedUser] = useState(initialUsers[0]);

  // Input message state
  const [message, setMessage] = useState("");

  // Chat messages shown in the chat window
  const [messages, setMessages] = useState([
    { from: "me", text: "Hi, is there anything I can help with?" },
    { from: "them", text: "Yes, it's about the assignment from yesterday" },
  ]);

  // Handle sending a new message
  const handleSend = () => {
    if (!message.trim()) return; // Prevent sending empty messages
    setMessages([...messages, { from: "me", text: message }]); // Add new message
    setMessage(""); // Clear input field
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - List of Users */}
      <aside className="w-1/3 border-r bg-white p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-[#0B1C47]">Inbox</h2>
        <ul>
          {initialUsers.map((user) => (
            <li
              key={user.id}
              className={`p-3 rounded-lg cursor-pointer mb-2 hover:bg-gray-100 ${
                selectedUser.id === user.id ? "bg-gray-200 font-semibold" : ""
              }`}
              onClick={() => {
                // Change selected user and display their message
                setSelectedUser(user);
                setMessages([
                  { from: "me", text: "Hello, is there anything I can help with?" },
                  { from: "them", text: user.lastMessage },
                ]);
              }}
            >
              <div className="flex justify-between">
                <span>{user.name}</span>
                <span className="text-xs text-gray-500">{user.time}</span>
              </div>
              <p className="text-sm text-gray-600">{user.lastMessage}</p>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Window */}
      <section className="w-2/3 p-6 flex flex-col bg-[#F9FAFB]">
        <h3 className="text-xl font-semibold text-[#0B1C47] mb-4 border-b pb-2">
          Chat with {selectedUser.name}
        </h3>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.from === "me"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-gray-900 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input and Send Button */}
        <div className="flex items-center gap-2 mt-auto">
          <input
            type="text"
            className="flex-1 border rounded-lg px-4 py-2"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-[#0B1C47] text-white px-4 py-2 rounded-lg hover:bg-[#102456]"
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
};

export default InboxApp;
