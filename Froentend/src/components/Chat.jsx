import React, { useState } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import instance from "../axios.Config";

const AIChatBox = ({ productName, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: `Hi 👋 Ask me anything about "${productName}"` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");

    try {
      setLoading(true);
      const res = await instance.post("/chat", { message: userMsg });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong 😐" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-6 w-96 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border z-50 animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-teal-600 text-white rounded-t-2xl">
        <h3 className="font-semibold">Product AI Assistant 🤖</h3>
        <button onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      {/* CHAT BODY */}
      <div className="p-4 h-72 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] p-2 rounded-lg text-sm ${
              msg.sender === "user"
                ? "ml-auto bg-teal-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <p className="text-sm italic text-gray-500">AI is typing...</p>
        )}
      </div>

      {/* INPUT */}
      <div className="flex gap-2 p-3 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${productName}...`}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-lg"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default AIChatBox;
