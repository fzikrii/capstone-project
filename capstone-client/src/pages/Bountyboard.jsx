import React, { useState, useMemo } from "react";
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';

// --- Data ---
const initialBounties = [
    { id: 1, title: 'Real-time Chat Application', description: 'Build a real-time chat app using WebSockets and React.', tags: [{ name: 'Socket.io', color: 'bg-sky-100 text-sky-700' }, { name: 'WebSocket', color: 'bg-blue-100 text-blue-700' }, { name: 'Realtime', color: 'bg-green-100 text-green-700' }], dueDate: '2025-08-25' },
    { id: 2, title: 'Build Responsive Landing Page', description: 'Create a mobile-friendly landing page using React and Tailwind CSS.', tags: [{ name: 'React', color: 'bg-cyan-100 text-cyan-700' }, { name: 'Tailwind', color: 'bg-teal-100 text-teal-700' }, { name: 'Frontend', color: 'bg-indigo-100 text-indigo-700' }], dueDate: '2025-08-10' },
    { id: 3, title: 'E-commerce Product Page', description: 'Develop a product page with dynamic content and user reviews.', tags: [{ name: 'React', color: 'bg-cyan-100 text-cyan-700' }, { name: 'API', color: 'bg-purple-100 text-purple-700' }, { name: 'Design', color: 'bg-pink-100 text-pink-700' }], dueDate: '2025-08-20' },
    { id: 4, title: 'REST API for Task Management', description: 'Design and develop a RESTful API for a task management system.', tags: [{ name: 'Node.js', color: 'bg-lime-100 text-lime-700' }, { name: 'Express', color: 'bg-gray-200 text-gray-700' }, { name: 'Backend', color: 'bg-stone-200 text-stone-700' }], dueDate: '2025-08-05' },
    { id: 5, title: 'UI Redesign for Dashboard', description: 'Improve usability and aesthetics of existing dashboard UI.', tags: [{ name: 'UX', color: 'bg-yellow-100 text-yellow-700' }, { name: 'UI', color: 'bg-orange-100 text-orange-700' }, { name: 'Figma', color: 'bg-red-100 text-red-700' }], dueDate: '2025-08-15' },
    { id: 6, title: 'UI Settings Page', description: 'Create a settings page for user preferences and configurations.', tags: [{ name: 'React', color: 'bg-cyan-100 text-cyan-700' }, { name: 'Settings', color: 'bg-slate-200 text-slate-700' }, { name: 'Frontend', color: 'bg-indigo-100 text-indigo-700' }], dueDate: '2025-08-30' },
];

// --- Bounty Card Component ---
const BountyCard = ({ bounty, onSelectBounty }) => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex-grow">
                <div className="flex items-start justify-between">
                    <h3 className="font-bold text-slate-800 text-lg">{bounty.title}</h3>
                    {/* Tampilan reward dihapus dari sini */}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    {bounty.tags.map((tag, index) => (
                        <span key={index} className={`px-2 py-1 text-xs font-semibold rounded-full ${tag.color}`}>{tag.name}</span>
                    ))}
                </div>
                <p className="text-slate-600 mt-4 text-sm">{bounty.description}</p>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4">
                 <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500">
                        Deadline: <span className="font-semibold text-slate-700">{new Date(bounty.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                    <button onClick={() => onSelectBounty(bounty)} className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors shadow-sm">View Details</button>
                </div>
            </div>
        </div>
    );
};

// --- Modal Component ---
const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 transform transition-transform duration-300 scale-95 animate-modal-in" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    const [bounties] = useState(initialBounties);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBounty, setSelectedBounty] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const filteredBounties = useMemo(() => {
        if (!searchTerm) return bounties;
        return bounties.filter(bounty => 
            bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bounty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bounty.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [bounties, searchTerm]);

    return (
        <div className="flex min-h-screen bg-white font-sans text-slate-800">
            <style>{`
                @keyframes modal-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-modal-in { animation: modal-in 0.2s ease-out forwards; }
            `}</style>
            
            <Sidebar isOpen={isSidebarOpen} />
            
            <div className="flex-1 flex flex-col">
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-200 flex items-center justify-between lg:hidden">
                    <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-slate-200">
                        <Icon name="menu" className="w-6 h-6 text-slate-600" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-800">Bounty Board</h1>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-12">
                     <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Bounty Board</h1>
                        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                            Discover exciting projects, complete tasks, and earn rewards. Begin your coding adventure here!
                        </p>
                    </div>

                    <div className="mb-12 max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search bounties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-5 py-3 border border-slate-300 rounded-full text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredBounties.map(bounty => (
                            <BountyCard key={bounty.id} bounty={bounty} onSelectBounty={setSelectedBounty} />
                        ))}
                    </div>
                </main>
            </div>

            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"></div>}

            <Modal isOpen={!!selectedBounty} onClose={() => setSelectedBounty(null)}>
                {selectedBounty && (
                    <div>
                        <div className="flex justify-between items-start">
                             <h2 className="text-3xl font-bold mb-2 text-slate-900">{selectedBounty.title}</h2>
                             {/* Tampilan reward dihapus dari sini */}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 mb-4">
                            {selectedBounty.tags.map((tag, index) => (
                                <span key={index} className={`px-3 py-1 text-sm font-semibold rounded-full ${tag.color}`}>{tag.name}</span>
                            ))}
                        </div>
                        <p className="text-slate-600 mb-4">{selectedBounty.description}</p>
                        <p className="text-sm text-slate-500 mb-6">
                            Deadline: <span className="font-semibold text-slate-700">{new Date(selectedBounty.dueDate).toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
                        </p>
                        <div className="flex justify-end gap-3 mt-6 border-t border-slate-200 pt-6">
                            <button onClick={() => setSelectedBounty(null)} className="px-5 py-2 bg-slate-200 rounded-lg font-semibold text-slate-800 hover:bg-slate-300 transition-colors">Close</button>
                             <button className="px-5 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors shadow-sm">Claim Bounty</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default App;