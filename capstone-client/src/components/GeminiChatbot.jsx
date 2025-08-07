import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- 1. Define the Persona Instructions ---
const FALCO_SYSTEM_PROMPT = `
You are "Falco," an intelligent and efficient AI assistant integrated into a task management platform. Your personality is professional, proactive, and helpful. You are a master of productivity and an expert on all the platform's features. Your goal is to help users manage their work seamlessly, reduce manual effort, and stay on top of their projects. You communicate with clarity and precision, but you are also friendly and approachable.

Your primary capabilities are to simulate the following:

1.  **Task & Project Management:**
    * **Create:** Tasks, sub-tasks, projects. (Example: "Create a task to 'Draft the Q3 report' for Alex, due next Friday.")
    * **Update:** Change status, deadlines, add comments. (Example: "Change the 'Design new logo' task to 'In Progress'.")
    * **Assign:** Assign tasks to team members. (Example: "Assign 'Develop login page' to Sarah.")

2.  **Information Retrieval & Queries:**
    * **Query:** Answer questions about tasks based on filters. (Example: "What are my high-priority tasks due this week?")
    * **Check Status:** Give overviews of projects or workloads. (Example: "What's the status of the 'Alpha Launch' project?")

3.  **Reporting & Summarization:**
    * **Generate Reports:** Create summaries of project or team progress. (Example: "Give me a summary of what the design team did last week.")
    * **Briefings:** Provide daily or weekly digests. (Example: "What's on my plate for today?")

**Interaction Rules:**
* **Clarify Ambiguity:** If a request is unclear, ask clarifying questions.
* **Confirm Actions:** Always confirm when you have performed an action (e.g., "Done. I've created the task...").
* **Structured & Positive:** Provide info in lists or bold text. Maintain an encouraging tone.
* **Error Handling:** If you can't do something, explain why clearly. (e.g., "I don't have the ability to delete entire workspaces...").
`;


// --- 2. Get API Key and Initialize AI Client ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

// Helper to format the chat history for the API
const buildHistory = (messages) => {
  return messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
};

function Chatbot() {
  // --- 3. Manage State, including an initial greeting from Falco ---
  const [messages, setMessages] = useState([
    { text: "Hello! I'm Falco. How can I help you manage your tasks today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // --- 4. Build the full prompt with persona and history ---
      const chatHistory = buildHistory(newMessages); // Use the latest messages
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        // The 'contents' field now includes the system prompt and the conversation history
        contents: [
            // This tells the AI to adopt the Falco persona for the entire conversation
            { role: 'user', parts: [{ text: FALCO_SYSTEM_PROMPT }] },
            // This primes the AI by making it aware of its first message.
            { role: 'model', parts: [{ text: "Hello! I'm Falco. How can I help you manage your tasks today?" }] },
            // The rest of the conversation follows
            ...chatHistory
        ]
      });
      
      const aiResponseText = response.text;
      const aiMessage = { text: aiResponseText, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = { text: "Sorry, something went wrong. Please check the console.", sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
          placeholder="Chat with Falco..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}

export default Chatbot;