import React, { useState, useEffect, useMemo } from "react";
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon'; // Assuming you have this component for the menu icon
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/bounty'; // Your backend bounty URL

const stripControlChars = (value) => String(value || "").replace(/[\u0000-\u001F\u007F]/g, "");

const sanitizeSearchInput = (value) => stripControlChars(value).normalize("NFKC").trimStart();

const DEFAULT_PROGRESS = {
    doneCount: 0,
    totalAssigned: 0,
    taskPoints: 0,
    volumeBonus: 0,
    totalPoints: 0,
    highlightTitle: "Rising Contributor",
};

// --- A helper to create dynamic tags from task data ---
const generateTags = (bounty) => {
    const tags = [];
    // Use the project name as a primary tag if it exists
    if (bounty.project && bounty.project.name) {
        tags.push({ name: bounty.project.name, color: 'bg-indigo-100 text-indigo-700' });
    }
    // Add a generic 'Task' tag
    tags.push({ name: 'Task', color: 'bg-slate-200 text-slate-700' });
    return tags;
};

// --- Bounty Card Component ---
const BountyCard = ({ bounty, onSelectBounty }) => {
    // Use the helper to generate tags dynamically for each bounty
    const tags = useMemo(() => generateTags(bounty), [bounty]);

    return (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex-grow">
                <div className="flex items-start justify-between">
                    <h3 className="font-bold text-slate-800 text-lg">{bounty.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                        <span key={index} className={`px-2 py-1 text-xs font-semibold rounded-full ${tag.color}`}>{tag.name}</span>
                    ))}
                </div>
                <p className="text-slate-600 mt-4 text-sm">{bounty.description}</p>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500">
                        {/* Use 'deadline' from the backend schema */}
                        Deadline: <span className="font-semibold text-slate-700">{new Date(bounty.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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

// --- Main BountyBoard Component ---
const BountyBoard = () => {
    // State for data, loading, and errors
    const [bounties, setBounties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [claimStatus, setClaimStatus] = useState("");
    const [isClaiming, setIsClaiming] = useState(false);

    // State for UI controls
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBounty, setSelectedBounty] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [myProgress, setMyProgress] = useState(DEFAULT_PROGRESS);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    // Fetch bounties from the backend when the component mounts
    useEffect(() => {
        const fetchBounties = async () => {
            setIsLoading(true);
            try {
                const userId = localStorage.getItem("userId");
                const requests = [
                    axios.get(API_BASE_URL, { withCredentials: true }),
                    axios.get(`${API_BASE_URL}/progress/me`, { withCredentials: true }),
                ];

                if (userId) {
                    requests.push(axios.get(`${API_BASE_URL}/user/${userId}`, { withCredentials: true }));
                }

                const [bountyResponse, progressResponse] = await Promise.all(requests);

                setBounties(Array.isArray(bountyResponse.data) ? bountyResponse.data : []);
                setMyProgress({ ...DEFAULT_PROGRESS, ...progressResponse.data });
                setError(null);
            } catch (err) {
                console.error("Failed to fetch bounties:", err);
                setError("Could not load bounties. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBounties();
    }, []);

    // Filter bounties based on search term
    const filteredBounties = useMemo(() => {
        if (!searchTerm) return bounties;
        const normalizedSearch = searchTerm.toLowerCase();
        return bounties.filter(bounty =>
            bounty.title.toLowerCase().includes(normalizedSearch) ||
            (bounty.description && bounty.description.toLowerCase().includes(normalizedSearch)) ||
            (bounty.project && bounty.project.name.toLowerCase().includes(normalizedSearch))
        );
    }, [bounties, searchTerm]);

    // Function to handle claiming a bounty
    const handleClaimBounty = async (bountyId) => {
        if (!bountyId || isClaiming) return;
        setIsClaiming(true);
        setClaimStatus("");
        try {
            const response = await axios.post(`${API_BASE_URL}/accept/${bountyId}`, {}, { withCredentials: true });
            
            // On success, remove the claimed bounty from the UI
            setBounties(currentBounties => currentBounties.filter(b => b._id !== bountyId));
            if (response.data?.progress) {
                setMyProgress({ ...DEFAULT_PROGRESS, ...response.data.progress });
            }
            setSelectedBounty(null); // Close the modal
            setClaimStatus(response.data.message || "Task transferred to your queue.");

        } catch (error) {
            console.error("Failed to claim bounty:", error);
            setClaimStatus(error.response?.data?.message || "An error occurred while claiming the bounty.");
        } finally {
            setIsClaiming(false);
        }
    };

    // Render logic for loading, error, and data states
    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center py-20 text-slate-500">Loading Bounties...</div>;
        }
        if (error) {
            return <div className="text-center py-20 text-rose-500">{error}</div>;
        }
        if (filteredBounties.length === 0) {
            return <div className="text-center py-20 text-slate-500">No bounties found.</div>;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredBounties.map(bounty => (
                    // Use `_id` from MongoDB for the key
                    <BountyCard key={bounty._id} bounty={bounty} onSelectBounty={setSelectedBounty} />
                ))}
            </div>
        );
    };

    return (
        <div className="flex h-screen min-h-screen bg-slate-50 font-sans text-slate-800">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-y-auto">
                {/* =================================== */}
                {/* HEADER SECTION - FULLY INCLUDED    */}
                {/* =================================== */}
                <header
                    className="sticky top-0 z-20 min-h-[65px] flex items-center justify-between px-4 border-b border-slate-200"
                    style={{ backgroundColor: '#0B1C47' }}
                >
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-slate-100/10">
                            <Icon name="menu" className="w-6 h-6 text-white" />
                        </button>
                        <h1 className="text-2xl font-bold text-white">Bounty Board</h1>
                    </div>
                </header>
                
                <main className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-12">
                    {/* =================================== */}
                    {/* PAGE TITLE SECTION - FULLY INCLUDED */}
                    {/* =================================== */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Bounty Board</h1>
                        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                            Transfer stuck tasks to your queue, finish them quickly, and earn points to unlock your highlight title.
                        </p>
                    </div>

                    <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Your Highlight Title</p>
                            <p className="mt-2 text-2xl font-extrabold text-sky-700">{myProgress.highlightTitle}</p>
                            <p className="mt-2 text-sm text-slate-600">
                                {myProgress.totalPoints} pts from {myProgress.doneCount} completed transferred tasks.
                            </p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Scoring Breakdown</p>
                            <p className="mt-2 text-sm text-slate-700">Speed & completion points: <span className="font-bold">{myProgress.taskPoints}</span></p>
                            <p className="mt-1 text-sm text-slate-700">Volume bonus (every 3 tasks): <span className="font-bold">{myProgress.volumeBonus}</span></p>
                            <p className="mt-1 text-sm text-slate-700">Assigned bounty tasks: <span className="font-bold">{myProgress.totalAssigned}</span></p>
                        </div>
                    </section>

                    {claimStatus && (
                        <div className="mb-8 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                            {claimStatus}
                        </div>
                    )}

                    {/* =================================== */}
                    {/* SEARCH BAR SECTION - FULLY INCLUDED */}
                    {/* =================================== */}
                    <div className="mb-12 max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search bounties by title, description, or project name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(sanitizeSearchInput(e.target.value))}
                            className="w-full px-5 py-3 border border-slate-300 rounded-lg text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                        />
                    </div>

                    {/* RENDER GRID OF BOUNTIES */}
                    {renderContent()}
                </main>
            </div>
            
            {/* Sidebar overlay and Modal for bounty details */}
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"></div>}
            
            <Modal isOpen={!!selectedBounty} onClose={() => setSelectedBounty(null)}>
                {selectedBounty && (
                    <div>
                        <h2 className="text-3xl font-bold mb-4 text-slate-900">{selectedBounty.title}</h2>
                        <p className="text-slate-600 mb-4">{selectedBounty.description}</p>
                        <p className="text-sm text-slate-500 mb-6">
                            Project: <span className="font-semibold text-slate-700">{selectedBounty.project?.name || 'N/A'}</span>
                        </p>
                        <p className="text-sm text-slate-500 mb-6">
                            Deadline: <span className="font-semibold text-slate-700">{new Date(selectedBounty.deadline).toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
                        </p>
                        <div className="flex justify-end gap-3 mt-6 border-t border-slate-200 pt-6">
                            <button onClick={() => setSelectedBounty(null)} className="px-5 py-2 bg-slate-200 rounded-lg font-semibold text-slate-800 hover:bg-slate-300 transition-colors">Close</button>
                            <button disabled={isClaiming} onClick={() => handleClaimBounty(selectedBounty._id)} className="px-5 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                                {isClaiming ? 'Transferring...' : 'Transfer Task'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BountyBoard;