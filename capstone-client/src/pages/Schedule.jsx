import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';

const calculateWorkDuration = (startDate) => {
    if (!startDate) return 'Unknown';
    const start = new Date(startDate);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) {
        years--;
        months += 12;
    }
    let duration = '';
    if (years > 0) duration += `${years} year${years > 1 ? 's' : ''} `;
    if (months > 0) duration += `${months} month${months > 1 ? 's' : ''}`;
    return duration.trim() || 'Less than a month';
};

const Profile = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [editData, setEditData] = useState(null);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;
        fetch(`http://localhost:5000/auth/user/${userId}`)
            .then(res => res.json())
            .then(data => setProfileData(data))
            .catch(err => console.error("Failed to fetch profile:", err));
    }, [userId]);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handleToggleEdit = () => {
        if (isEditing) {
            setEditData(null);
            setIsEditing(false);
        } else {
            setEditData(profileData);
            setIsEditing(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/auth/user/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData)
            });
            const updated = await response.json();
            setProfileData(updated);
            setIsEditing(false);
            setEditData(null);
        } catch (err) {
            console.error("Failed to save profile:", err);
        }
    };

    if (!profileData) {
        return <div className="p-8">Loading profile...</div>;
    }

    const currentData = isEditing ? editData : profileData;
    const workDuration = useMemo(() => calculateWorkDuration(currentData.workStartDate), [currentData.workStartDate]);

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 p-8">
                <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Profile</h2>
                        <button
                            className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
                            onClick={handleToggleEdit}
                        >
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                    </div>
                    <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={currentData.username || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="mt-1 w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={currentData.email || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="mt-1 w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Work Start Date</label>
                            <input
                                type="date"
                                name="workStartDate"
                                value={currentData.workStartDate ? currentData.workStartDate.slice(0, 10) : ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="mt-1 w-full px-3 py-2 border rounded-lg"
                            />
                            <div className="text-xs text-slate-500 mt-1">
                                Duration: {workDuration}
                            </div>
                        </div>
                        {isEditing && (
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                            >
                                Save
                            </button>
                        )}
                    </form>
                </div>
            </div>
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"></div>}
        </div>
    );
};

export default Profile;