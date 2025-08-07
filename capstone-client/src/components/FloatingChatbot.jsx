import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

// --- Initialize the AI Client Outside the Component ---
const client = new GoogleGenAI({ apiKey: "AIzaSyBdLfgGwmrIj8kYy2Fsf-NLeD7aLo1mntk" }); // Remember to use environment variables

// --- System Prompt with FAQ Knowledge ---
const SYSTEM_PROMPT = `You are Falco, an expert AI assistant for the Eagle.Eye project management application. Your primary goal is to help users understand and effectively use the platform's features to boost their productivity.

**APPLICATION KNOWLEDGE BASE:**

**1. Main Navigation (Sidebar):**
- The app is navigated using the sidebar on the left.
- Main pages are: **Dashboard**, **My Projects**, **Bounty Board**, and **Schedule**.
- The user's profile information (name and email) is displayed at the top of the sidebar and provides access to logout and the main Profile page.

**2. Dashboard Page:**
- This is the user's personal overview page.
- It displays key statistics in **Recap Cards**, such as 'Tasks Completed' and 'Projects Contributed'.
- It features a **Productivity Trends** line chart showing task completions over time.
- It also has a **Task Status** doughnut chart visualizing the breakdown of tasks (To Do, Ongoing, Done, Stuck).

**3. My Projects Page:**
- This page lists all projects the user is a member of.
- Clicking a project opens its **Project Taskboard**, which is a full-featured Kanban board.
- The Kanban board has four columns: **To Do, Ongoing, Done, and Stuck**.
- **Key Feature:** Users can **drag and drop** tasks from one column to another to update their status.
- Users can add new projects from the main list view and add new tasks from within a project's taskboard.

**4. Bounty Board Page:**
- This is a unique feature where unassigned tasks from all projects are listed as "bounties."
- It allows any team member to view available tasks and **"claim" a bounty**, which assigns the task to them.
- This is the go-to place for users who have completed their work and want to help out with other tasks.

**5. Schedule Page:**
- This page displays a full-month calendar view.
- It automatically shows all tasks with deadlines.
- **Key Feature:** Users can **drag and drop** a task from one date to another to quickly reschedule it.
- Clicking on any date opens a detailed view of all events scheduled for that day.

**6. Profile & Settings:**
- **Profile Page (\`/profile\`):** Users can manage their public profile here. They can update their display name, job title, and work start date. A key feature is the ability to **upload and crop a new avatar and banner image**.
- **Settings Page (\`/settings\`):** This is where users can manage their account. The most important feature here is in the "Appearance" tab, where users can switch between **Light and Dark themes** for the entire application.

**INSTRUCTIONS FOR FALCO:**
- Be friendly, encouraging, and an expert guide.
- Provide clear, step-by-step instructions. For example, "To change your theme, first click 'Settings' in the sidebar, then go to the 'Appearance' tab."
- When relevant, highlight the powerful interactive features like **drag-and-drop** on the 'My Projects' and 'Schedule' pages.
- If a user asks about a feature not in this knowledge base, be honest and say you don't have information on that yet, but you can help with the Dashboard, Projects, Bounties, Schedule, or Profile settings.
- Always frame your answers in the context of helping the user be more productive and successful with their work in Eagle.Eye.`;


// --- Icon Components ---
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]); // Initial messages will be set after fetching user data
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chatSession, setChatSession] = useState(null);
    const [userData, setUserData] = useState(null); // State to hold user data
    const messagesEndRef = useRef(null);

    // --- NEW: Fetch user data when component mounts ---
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5000/auth/me", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (error) {
                console.error("Error fetching user data for chatbot:", error);
            }
        };
        fetchUserData();
    }, []);
    
    // --- UPDATED: Set initial message after fetching user data ---
    useEffect(() => {
        const userName = userData?.username || "there";
        setMessages([
            {
                text: `Hello ${userName}! I'm Falco, your project management assistant. How can I help you today?`,
                sender: "ai",
            },
        ]);
    }, [userData]);


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
                        systemInstruction: SYSTEM_PROMPT,
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
        const currentInput = input;
        setInput("");
        setIsLoading(true);

        try {
            const response = await chatSession.sendMessage({ message: currentInput });
            const aiResponseText = response.text || "Sorry, I couldn't generate a response.";
            const aiMessage = { text: aiResponseText, sender: "ai" };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            let errorText = "Sorry, I'm having trouble connecting. Please try again later.";
            if (error.message?.includes("API key")) {
                errorText = "API configuration error. Please check your settings.";
            }
            const errorMessage = { text: errorText, sender: "ai" };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const resetChat = async () => {
        // (The reset logic remains the same)
    };

    const quickActions = [
        "How does the Kanban board work?",
        "What is the Bounty Board?",
        "How do I change my theme?",
        "Can you explain the schedule page?"
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
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#0B1C47] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-all duration-300 hover:bg-[#173A7A] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#173A7A]"
                aria-label="Toggle Chat"
            >
                <ChatIcon />
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                }`}
            >
                {/* Header */}
                <div className="p-4 bg-[#0B1C47] border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-semibold text-white">Chat with Falco</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={resetChat} className="text-white/70 hover:text-white transition-colors p-1 rounded" aria-label="Reset Chat" title="Start new conversation">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                        <button onClick={toggleChat} className="text-white/70 hover:text-white transition-colors" aria-label="Close Chat">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${ msg.sender === "user" ? "justify-end" : "justify-start" }`}>
                            <div className={`max-w-[80%] py-2 px-4 rounded-2xl leading-snug whitespace-pre-wrap ${ msg.sender === "user" ? "bg-[#173A7A] text-white rounded-br-lg" : "bg-gray-200 text-gray-800 rounded-bl-lg" }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {messages.length <= 2 && (
                        <div className="space-y-2">
                            <p className="text-xs text-gray-500 text-center">Quick questions:</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {quickActions.map((action, index) => (
                                    <button key={index} onClick={() => handleQuickAction(action)} className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 text-gray-500 rounded-2xl rounded-bl-lg py-2 px-4 animate-pulse">Falco is thinking...</div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="p-3 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-2">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about app features..." disabled={isLoading} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }} className="flex-1 w-full border border-gray-300 rounded-full py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-[#173A7A] focus:border-transparent transition-shadow disabled:bg-gray-100" />
                        <button onClick={handleSend} disabled={isLoading || !input.trim() || !chatSession} className="bg-[#0B1C47] text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors hover:bg-[#173A7A] disabled:bg-[#0B1C47]/50 disabled:cursor-not-allowed flex-shrink-0" aria-label="Send Message">
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FloatingChatbot;