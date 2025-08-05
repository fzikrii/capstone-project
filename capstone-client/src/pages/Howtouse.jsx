import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';

// --- FAQ Data (Translated to English) ---
const faqData = [
    {
        question: "How do I navigate the app?",
        answer: "Use the sidebar on the left side to access all main pages like Dashboard, My Projects, Bounty Board, Schedule, and Settings. The currently active page will be highlighted with a brighter color."
    },
    {
        question: "What is the function of the 'My Projects' page?",
        answer: "The 'My Projects' page displays all your projects in a Kanban Board format. You can move projects between columns (To Do, Ongoing, Done, Stuck) using drag-and-drop to manage your workflow."
    },
    {
        question: "How do I use the 'Schedule' feature?",
        answer: "The 'Schedule' page shows a monthly calendar. You can view task schedules and deadlines. Use the arrow buttons to switch between months and the 'Today' button to return to the current month. Click a date to view its daily schedule details."
    },
    {
        question: "What is the 'Bounty Board'?",
        answer: "The Bounty Board is a page that lists all individual tasks from all your projects. It's designed to help you focus on the tasks that need to be completed, separated by those due today and upcoming ones."
    },
    {
        question: "How can I change the app theme (Light/Dark Mode)?",
        answer: "Go to the 'Settings' page via the sidebar, then click on the 'Appearance' tab. There you’ll find options to switch between Light and Dark themes. Your selection will be saved automatically in the browser."
    },
    {
        question: "Can I update my profile information?",
        answer: "Yes, absolutely. In the 'Settings' page, open the 'Profile' tab. You can upload a new profile picture and update your username and job title. Don’t forget to click 'Save Changes' after you're done."
    }
];

// --- Accordion Component ---
const AccordionItem = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-200">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left py-4 px-1"
            >
                <span className="font-semibold text-slate-800">{item.question}</span>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} className="w-5 h-5 text-slate-500" />
            </button>
            {isOpen && (
                <div className="pb-4 px-1 text-slate-600">
                    <p>{item.answer}</p>
                </div>
            )}
        </div>
    );
};

const HowToUse = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handleAccordionClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFaqData = useMemo(() => {
        if (!searchTerm) return faqData;
        const lowercasedFilter = searchTerm.toLowerCase();
        return faqData.filter(item =>
            item.question.toLowerCase().includes(lowercasedFilter) ||
            item.answer.toLowerCase().includes(lowercasedFilter)
        );
    }, [searchTerm]);

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-slate-200">
                            <Icon name="menu" className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800">How To Use / FAQ</h1>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Need help with something?</h2>
                            <p className="text-slate-600">Find answers to frequently asked questions below.</p>
                        </div>

                        <div className="mb-8">
                            <input
                                type="text"
                                placeholder="Search a question..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            {filteredFaqData.length > 0 ? (
                                filteredFaqData.map((item, index) => (
                                    <AccordionItem
                                        key={index}
                                        item={item}
                                        isOpen={openIndex === index}
                                        onClick={() => handleAccordionClick(index)}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-slate-500 py-8">No results found for your search.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"></div>}
        </div>
    );
};

export default HowToUse;
