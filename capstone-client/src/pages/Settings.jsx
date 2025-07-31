import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';


const Header = () => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    return (
        <header className="relative z-10 bg-white border-b">
            <div className="flex items-center justify-between h-16 md:h-20 px-6 mx-auto">
                <div className="relative w-full max-w-xl mr-6 focus-within:text-indigo-500">
                    <div className="absolute inset-y-0 flex items-center pl-2">
                         <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                    </div>
                    <input className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md focus:placeholder-gray-500 focus:bg-white focus:border-indigo-300 focus:outline-none focus:shadow-outline-indigo form-input" type="text" placeholder="Cari..." aria-label="Search" />
                </div>
                <div className="relative">
                    <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center align-middle rounded-full focus:shadow-outline-purple focus:outline-none" aria-label="Account" aria-haspopup="true">
                        <img className="object-cover w-10 h-10 rounded-full" src="https://placehold.co/100x100/eab308/ffffff?text=JD" alt="Your Name" aria-hidden="true" />
                    </button>
                    {isProfileOpen && (
                        <div className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md">
                            <a className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 rounded-md hover:bg-indigo-500 hover:text-white" href="#">Profile</a>
                            <a className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 rounded-md hover:bg-indigo-500 hover:text-white" href="#">Settings</a>
                            <a className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 rounded-md hover:bg-indigo-500 hover:text-white" href="#">Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

// --- KOMPONEN KONTEN PENGATURAN ---

const SettingsContent = () => {
    const [profile, setProfile] = useState({
        name: 'Elmira',
        email: 'elmira@example.com'
    });
    const [isDarkMode, setDarkMode] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        // Di aplikasi nyata, di sini Anda akan mengirim data ke API
        alert(`Perubahan disimpan!\nNama: ${profile.name}\nEmail: ${profile.email}\nMode Gelap: ${isDarkMode ? 'Aktif' : 'Nonaktif'}`);
    };

    return (
        <main className="flex-1 h-full p-6 md:p-8 overflow-y-auto bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Pengaturan</h1>

            <div className="max-w-4xl mx-auto space-y-10">
                {/* Bagian Profil */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Profil Publik</h2>
                    <div className="flex items-center space-x-6 mb-6">
                        <img src="https://placehold.co/96x96/eab308/ffffff?text=E" alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                        <div>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                Unggah Foto Baru
                            </button>
                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF hingga 10MB.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input type="text" name="name" id="name" value={profile.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                            <input type="email" name="email" id="email" value={profile.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>
                </div>

                {/* Bagian Tampilan (Mode Gelap) */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Tampilan</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-md font-medium text-gray-800">Mode Gelap</h3>
                            <p className="text-sm text-gray-500">Ubah tampilan antarmuka menjadi tema gelap.</p>
                        </div>
                        <label htmlFor="dark-mode-toggle" className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="dark-mode-toggle" className="sr-only peer" checked={isDarkMode} onChange={() => setDarkMode(!isDarkMode)} />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>

                {/* Bagian Tentang */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Tentang Aplikasi</h2>
                    <div className="space-y-3">
                         <a href="#" className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                            <span className="text-md font-medium text-gray-800">Syarat & Ketentuan</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </a>
                         <a href="#" className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                            <span className="text-md font-medium text-gray-800">Kebijakan Privasi</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </a>
                    </div>
                </div>

                {/* Tombol Simpan */}
                <div className="flex justify-end">
                    <button onClick={handleSaveChanges} className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </main>
    );
};


// --- KOMPONEN UTAMA APLIKASI ---

export default function App() {
    const [activeSidebarItem, setActiveSidebarItem] = useState('Settings');

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar activeItem={activeSidebarItem} setActiveItem={setActiveSidebarItem} />
            <div className="flex flex-col flex-1 w-full overflow-hidden">
                <Header />
                <SettingsContent />
            </div>
        </div>
    );
}
