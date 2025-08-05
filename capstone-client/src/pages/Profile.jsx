// src/pages/Profile.jsx

import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';

// --- Initial Data (In a real app, this would come from an API) ---
const initialProfileData = {
    name: 'Jonathan Ezra',
    title: 'Project Manager',
    avatarUrl: 'https://placehold.co/128x128/a7f3d0/14532d?text=JE',
    bannerUrl: 'https://placehold.co/1200x300/e0e7ff/4338ca',
    workStartDate: '2022-01-15', // Format YYYY-MM-DD
    certificates: [
        { id: 1, name: 'Certified Scrum Master', fileUrl: '#' },
        { id: 2, name: 'Project Management Professional (PMP)', fileUrl: '#' },
    ]
};

// --- Helper function to calculate work duration ---
const calculateWorkDuration = (startDate) => {
    if (!startDate) return 'Not specified';
    const start = new Date(startDate);
    const now = new Date();
    
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < start.getDate())) {
        years--;
        months = (months + 12) % 12;
    }

    let duration = '';
    if (years > 0) duration += `${years} year${years > 1 ? 's' : ''} `;
    if (months > 0) duration += `${months} month${months > 1 ? 's' : ''}`;
    
    return duration.trim() || 'Less than a month';
};


const Profile = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(initialProfileData);
    
    // Temporary state to hold changes during edit mode
    const [editData, setEditData] = useState(null);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    // Function to start or cancel edit mode
    const handleToggleEdit = () => {
        if (isEditing) {
            // On cancel, discard changes
            setEditData(null);
        } else {
            // When starting edit, copy current profile data to editData state
            // Using JSON methods for a deep copy to handle the nested certificates array
            setEditData(JSON.parse(JSON.stringify(profileData)));
        }
        setIsEditing(!isEditing);
    };

    // Function to save changes
    const handleSave = () => {
        // In a real app, you would send `editData` to your API here
        console.log('Saving data:', editData);
        setProfileData(editData);
        setIsEditing(false);
        setEditData(null);
        // Optionally, show a success notification
    };

    // Handler for simple text inputs (name, title)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    // Handler for image changes (profile & banner)
    const handleImageChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            // Create a local preview URL
            setEditData({
                ...editData,
                [field]: URL.createObjectURL(file) 
            });
        }
    };
    
    // Handler to add a new certificate
    const handleAddCertificate = () => {
        const newCert = { id: Date.now(), name: 'New Certificate', fileUrl: '' };
        setEditData({
            ...editData,
            certificates: [...editData.certificates, newCert]
        });
    };

    // Handler to remove a certificate
    const handleRemoveCertificate = (id) => {
        setEditData({
            ...editData,
            certificates: editData.certificates.filter(cert => cert.id !== id)
        });
    };

    // Handler to update a certificate's data (name or file)
    const handleCertificateChange = (e, id) => {
        const { name, value, files } = e.target;
        const updatedCerts = editData.certificates.map(cert => {
            if (cert.id === id) {
                if (name === 'cert-name') {
                    return { ...cert, name: value };
                }
                if (name === 'cert-file' && files[0]) {
                    return { ...cert, fileUrl: URL.createObjectURL(files[0]) };
                }
            }
            return cert;
        });
        setEditData({ ...editData, certificates: updatedCerts });
    };

    // Determine which data to display (live or editing)
    const currentData = isEditing ? editData : profileData;
    // Recalculate work duration whenever the start date changes
    const workDuration = useMemo(() => calculateWorkDuration(currentData.workStartDate), [currentData.workStartDate]);

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-slate-200">
                            <Icon name="menu" className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                    </div>
                    {/* Edit / Save & Cancel Buttons */}
                    <div className="flex items-center gap-2">
                        {isEditing && (
                            <button onClick={handleToggleEdit} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors">
                                Cancel
                            </button>
                        )}
                        <button 
                            onClick={isEditing ? handleSave : handleToggleEdit}
                            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
                        >
                            <Icon name={isEditing ? "save" : "edit-3"} className="w-4 h-4" />
                            <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-0">
                    {/* Banner Section */}
                    <div className="relative h-48 md:h-64 bg-slate-200 group">
                        <img src={currentData.bannerUrl} alt="Banner" className="w-full h-full object-cover"/>
                        {isEditing && (
                            <label htmlFor="banner-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <Icon name="camera" className="w-8 h-8"/>
                                <span className="ml-2 text-lg font-semibold">Change Banner</span>
                                <input id="banner-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'bannerUrl')} />
                            </label>
                        )}
                    </div>
                    
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        {/* Profile Header */}
                        <div className="-mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-6">
                            <div className="relative group">
                                <img src={currentData.avatarUrl} alt="User Avatar" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"/>
                                {isEditing && (
                                    <label htmlFor="avatar-upload" className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icon name="camera" className="w-6 h-6"/>
                                        <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'avatarUrl')} />
                                    </label>
                                )}
                            </div>
                            <div className="text-center md:text-left md:pb-4">
                                {isEditing ? (
                                    <input type="text" name="name" value={editData.name} onChange={handleInputChange} className="text-3xl font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-md px-2 py-1 w-full" />
                                ) : (
                                    <h2 className="text-3xl font-bold text-slate-800">{currentData.name}</h2>
                                )}
                                {isEditing ? (
                                    <input type="text" name="title" value={editData.title} onChange={handleInputChange} className="text-lg text-slate-500 bg-slate-100 border border-slate-300 rounded-md px-2 py-1 w-full mt-1" />
                                ) : (
                                    <p className="text-lg text-slate-500">{currentData.title}</p>
                                )}
                            </div>
                        </div>

                        {/* Profile Details Grid */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Left Column - Work Info */}
                            <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Work Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-500">Work Duration</label>
                                        <p className="text-slate-800 text-lg font-medium flex items-center gap-2"><Icon name="clock" className="w-5 h-5 text-sky-600"/>{workDuration}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="workStartDate" className="text-sm font-semibold text-slate-500">Work Start Date</label>
                                        {isEditing ? (
                                            <input type="date" name="workStartDate" id="workStartDate" value={editData.workStartDate} onChange={handleInputChange} className="w-full bg-slate-100 border border-slate-300 rounded-md p-2 mt-1" />
                                        ) : (
                                            <p className="text-slate-800 flex items-center gap-2"><Icon name="calendar" className="w-5 h-5 text-sky-600"/>{new Date(currentData.workStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Certificates */}
                            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-slate-800">Certificates</h3>
                                    {isEditing && <button onClick={handleAddCertificate} className="bg-sky-100 text-sky-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-sky-200">+ Add New</button>}
                                </div>
                                <div className="space-y-4">
                                    {currentData.certificates.length > 0 ? currentData.certificates.map(cert => (
                                        <div key={cert.id} className={`p-3 rounded-lg flex items-center gap-4 ${isEditing ? 'bg-slate-50' : ''}`}>
                                            <div className="flex-shrink-0 bg-sky-100 text-sky-600 p-2 rounded-full">
                                                <Icon name="award" className="w-6 h-6" />
                                            </div>
                                            <div className="flex-grow">
                                                {isEditing ? (
                                                    <input type="text" name="cert-name" value={cert.name} onChange={(e) => handleCertificateChange(e, cert.id)} placeholder="Certificate Name" className="w-full bg-white border border-slate-300 rounded-md p-2" />
                                                ) : (
                                                    <p className="font-semibold text-slate-700">{cert.name}</p>
                                                )}
                                                
                                                {isEditing ? (
                                                    <div className="mt-2">
                                                        <label className="block text-sm font-medium text-gray-700">Update file:</label>
                                                        <input type="file" name="cert-file" onChange={(e) => handleCertificateChange(e, cert.id)} className="text-sm text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"/>
                                                    </div>
                                                ) : (
                                                    <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline">View Certificate</a>
                                                )}
                                            </div>
                                            {isEditing && (
                                                <button onClick={() => handleRemoveCertificate(cert.id)} className="text-slate-400 hover:text-red-500 p-1">
                                                    <Icon name="trash-2" className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    )) : (
                                        <p className="text-slate-500 text-center py-4">No certificates added.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"></div>}
        </div>
    );
};

export default Profile;
