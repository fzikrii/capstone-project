import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

// --- Initialize the AI Client Outside the Component ---
// IMPORTANT: In production, use environment variables to secure your API key
const client = new GoogleGenAI({ apiKey: "AIzaSyBdLfgGwmrIj8kYy2Fsf-NLeD7aLo1mntk" });

// --- System Prompt with FAQ Knowledge ---
const SYSTEM_PROMPT = `You are Falco, a helpful AI assistant for a project management application. You have comprehensive knowledge about the app and can help users navigate and use its features effectively.

**APP KNOWLEDGE BASE:**

**Main Features & Navigation:**
- The app has a sidebar on the left with main pages: Dashboard, My Projects, Bounty Board, Schedule, and Settings
- The currently active page is highlighted with a brighter color in the sidebar
- On mobile devices, users can toggle the sidebar using the menu button

**My Projects Page:**
- Displays all user projects in a Kanban Board format
- Projects can be moved between columns: To Do, Ongoing, Done, Stuck
- Uses drag-and-drop functionality for workflow management
- Helps users organize and track project progress

**Schedule Feature:**
- Shows a monthly calendar view
- Displays task schedules and deadlines
- Navigation: Use arrow buttons to switch between months
- "Today" button returns to current month
- Users can click on any date to view daily schedule details

**Bounty Board:**
- Lists all individual tasks from all projects in one place
- Designed to help users focus on tasks that need completion
- Separates tasks into "due today" and "upcoming" categories
- Provides a consolidated task view across all projects

**Settings & Customization:**
- Theme switching: Users can change between Light and Dark modes
- Location: Settings > Appearance tab
- Theme selection is automatically saved in the browser
- Profile management: Users can update profile information in Settings > Profile tab
- Profile features: Upload profile picture, update username and job title
- Remember to click "Save Changes" after profile updates

**INSTRUCTIONS:**
- Be friendly, helpful, and conversational
- Provide specific, actionable guidance based on the app's features
- If a user asks about features not covered in your knowledge base, be honest and suggest they explore the app or check for updates
- Use natural language and avoid being overly formal
- When explaining features, provide step-by-step instructions when helpful
- Encourage users to try features and explore the app
- If users seem confused, offer to guide them through specific tasks

Remember: You are part of this project management app ecosystem, so always frame your responses in the context of helping users be more productive with their projects and tasks.`

// --- Komponen Ikon ---
const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
    />
  </svg>
);

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
    />
  </svg>
);

function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm Falco, your project management assistant. I can help you navigate the app, understand features like the Kanban board, schedule, bounty board, and settings. What would you like to know?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize chat session when component mounts
  useEffect(() => {
    const initializeChatSession = async () => {
      try {
        const chat = await client.chats.create({
          model: "gemini-2.0-flash-exp",
          config: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1000,
            systemInstruction: SYSTEM_PROMPT, // Add system prompt here
          },
        });
        setChatSession(chat);
      } catch (error) {
        console.error("Error initializing chat session:", error);
      }
    };

    initializeChatSession();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 300);
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatSession) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input; // Store input before clearing
    setInput("");
    setIsLoading(true);

    try {
      // --- Use Chat Session with sendMessage ---
      const response = await chatSession.sendMessage({
        message: currentInput,
      });

      const aiResponseText = response.text || "Sorry, I couldn't generate a response.";
      const aiMessage = { text: aiResponseText, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
      
    } catch (error) {
      console.error("Error fetching AI response:", error);
      
      // More specific error handling
      let errorText = "Sorry, I'm having trouble connecting. Please try again later.";
      if (error.message?.includes("API key")) {
        errorText = "API configuration error. Please check your settings.";
      } else if (error.message?.includes("quota")) {
        errorText = "Service temporarily unavailable. Please try again later.";
      } else if (error.message?.includes("chat session")) {
        errorText = "Chat session error. Please refresh and try again.";
      }
      
      const errorMessage = {
        text: errorText,
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset chat session and history
  const resetChat = async () => {
    try {
      const newChat = await client.chats.create({
        model: "gemini-2.0-flash-exp",
        config: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1000,
          systemInstruction: SYSTEM_PROMPT, // Include system prompt in reset
        },
      });
      setChatSession(newChat);
      setMessages([
        {
          text: "Hello! I'm Falco, your project management assistant. I can help you navigate the app, understand features like the Kanban board, schedule, bounty board, and settings. What would you like to know?",
          sender: "ai",
        },
      ]);
    } catch (error) {
      console.error("Error resetting chat session:", error);
    }
  };

  // Quick action buttons for common questions
  const quickActions = [
    "How do I navigate the app?",
    "What is the Bounty Board?",
    "How to change themes?",
    "How does the Kanban board work?"
  ];

  const handleQuickAction = (question) => {
    setInput(question);
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-all duration-300 hover:bg-purple-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        aria-label="Toggle Chat"
      >
        <ChatIcon />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Chat with Falco</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={resetChat}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded"
              aria-label="Reset Chat"
              title="Start new conversation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <button
              onClick={toggleChat}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Close Chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] py-2 px-4 rounded-2xl leading-snug whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white rounded-br-lg"
                    : "bg-gray-200 text-gray-800 rounded-bl-lg"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Quick Action Buttons - Show only when there are few messages */}
          {messages.length <= 2 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 text-center">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-500 rounded-2xl rounded-bl-lg py-2 px-4 animate-pulse">
                Falco is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about app features, navigation, settings..."
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              className="flex-1 w-full border border-gray-300 rounded-full py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-shadow disabled:bg-gray-100"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || !chatSession}
              className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send Message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FloatingChatbot;