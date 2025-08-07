import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- 1. Initialize the AI Client Outside the Component ---
// IMPORTANT: Use your actual API key and secure it with environment variables
// This should not be hardcoded in a real application.
const ai = new GoogleGenAI({ apiKey: "AIzaSyBdLfgGwmrIj8kYy2Fsf-NLeD7aLo1mntk" });

function GeminiChatbot() {
  // --- 2. Manage State with useState ---
  const [messages, setMessages] = useState([]); // Stores the chat history
  const [input, setInput] = useState('');       // Stores the user's current input
  const [isLoading, setIsLoading] = useState(false); // Tracks if the AI is "thinking"

  // --- 3. Create an async function to handle the API call ---
  const handleSend = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]); // Add user's message to the chat
    setInput(''); // Clear the input field
    setIsLoading(true);

    try {
      // --- This is where your original logic goes ---
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: input, // Use the user's input as the prompt
        // You can add your config here if needed
      });
      
      const aiResponseText = response.text;
      const aiMessage = { text: aiResponseText, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]); // Add AI's response to the chat

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = { text: "Sorry, something went wrong.", sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]); // Show an error message
    } finally {
      setIsLoading(false); // Stop the loading indicator
    }
  };

  // --- 4. Render the UI (JSX) ---
  return (
    <div className="chatbot-container">
      <div className="messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {isLoading && <div className="message ai"><p>Thinking...</p></div>}
      </div>
      <form onSubmit={handleSend} className="chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}

export default GeminiChatbot;