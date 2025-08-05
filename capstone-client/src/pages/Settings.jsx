import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';

// --- SETTINGS CONTENT COMPONENTS ---

// Card Wrapper component for each settings section
const SettingsCard = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <div className="p-6 space-y-6">
            {children}
        </div>
    </div>
);

// Component for each row inside a card
const SettingsRow = ({ title, description, children }) => (
     <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-2 md:mb-0">
            <h4 className="font-semibold text-slate-700">{title}</h4>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex-shrink-0">
            {children}
        </div>
    </div>
);

// --- GROUP OF SETTINGS COMPONENTS ---

const ProfileSettings = () => (
    <SettingsCard title="Public Profile">
        <div className="flex items-center space-x-6">
            <img src="https://placehold.co/96x96/a7f3d0/14532d?text=JE" alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            <div>
                <button className="px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600">Upload New Photo</button>
                <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF up to 10MB.</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input type="text" name="name" id="name" defaultValue="Jonathan Ezra" className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div>
                <label htmlFor="profession" className="block text-sm font-medium text-slate-700 mb-1">Profession / Job Title</label>
                <input type="text" name="profession" id="profession" defaultValue="Project Manager" className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500" />
            </div>
        </div>
    </SettingsCard>
);

const AccountSettings = () => (
    <>
        <SettingsCard title="Account">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input type="email" name="email" id="email" defaultValue="jooeyy@example.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500" />
            </div>
        </SettingsCard>
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border-t-4 border-rose-500">
            <h3 className="text-xl font-bold text-rose-700 mb-2">Danger Zone</h3>
            <SettingsRow title="Delete This Account" description="Once deleted, all data will be permanently lost.">
                 <button className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700">Delete Account</button>
            </SettingsRow>
        </div>
    </>
);

const AppearanceSettings = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <SettingsCard title="Appearance">
            <SettingsRow title="Theme" description="Choose light or dark mode.">
                <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setTheme('light')} className={`px-3 py-1 text-sm font-medium rounded-md ${theme === 'light' ? 'bg-white text-sky-600 shadow' : 'text-slate-600'}`}>Light</button>
                    <button onClick={() => setTheme('dark')} className={`px-3 py-1 text-sm font-medium rounded-md ${theme === 'dark' ? 'bg-slate-700 text-white shadow' : 'text-slate-600'}`}>Dark</button>
                </div>
            </SettingsRow>
        </SettingsCard>
    );
};


// --- MAIN SETTINGS PAGE COMPONENT ---

const Settings = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileSettings />;
            case 'account': return <AccountSettings />;
            case 'appearance': return <AppearanceSettings />;
            default: return <ProfileSettings />;
        }
    };
    
    const navItems = [
        { id: 'profile', label: 'Profile' },
        { id: 'account', label: 'Account' },
        { id: 'appearance', label: 'Appearance' },
        { id: 'security', label: 'Security' },
        { id: 'notifications', label: 'Notifications' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-slate-200">
                            <Icon name="menu" className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Tab Navigation */}
                        <div className="mb-8 border-b border-slate-200">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                {navItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                                            activeTab === item.id
                                            ? 'border-sky-500 text-sky-600'
                                            : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-8">
                            {renderContent()}
                            <div className="flex justify-end mt-6">
                                <button className="px-6 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"></div>}
        </div>
    );
};

export default Settings;