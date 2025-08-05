import React, { useState, useEffect } from 'react';
import { LayoutDashboard, KanbanSquare, Calendar, HelpCircle, Settings, Inbox, ChevronLeft, ChevronRight, Bell, Sun, Moon, User, Award, Zap, BarChart2, Plus, MoreHorizontal } from 'lucide-react';

// --- Mock Data (Data Tiruan) ---
// Ini adalah data pengganti. Nantinya, ini akan datang dari database Anda (MongoDB).
const userData = {
  name: 'Jonathan Ezra Navarro',
  title: 'Project Manager',
  avatarUrl: 'https://placehold.co/100x100/6366F1/FFFFFF?text=AW',
  stats: {
    tasksCompleted: 78,
    projectsContributed: 6,
    topContributorIn: 2,
  }
};

const projectData = {
  'todo': {
    name: 'To Do',
    color: 'bg-slate-500',
    tasks: [
      { id: 'task-1', title: 'Rancang ulang alur login pengguna', tags: ['UI/UX', 'Penting'] },
      { id: 'task-2', title: 'Siapkan endpoint API untuk profil', tags: ['Backend'] },
    ],
  },
  'ongoing': {
    name: 'Ongoing',
    color: 'bg-blue-500',
    tasks: [
      { id: 'task-3', title: 'Implementasi komponen Sidebar React', tags: ['Frontend', 'Prioritas Tinggi'] },
      { id: 'task-4', title: 'Desain skema database untuk proyek', tags: ['Database'] },
      { id: 'task-5', title: 'Buat komponen Kartu Tugas', tags: ['Frontend'] },
    ],
  },
  'done': {
    name: 'Done',
    color: 'bg-green-500',
    tasks: [
      { id: 'task-6', title: 'Setup proyek Next.js dengan Tailwind', tags: ['Setup'] },
      { id: 'task-7', title: 'Buat desain awal di Figma', tags: ['Desain'] },
    ],
  },
  'stuck': {
    name: 'Stuck',
    color: 'bg-red-500',
    tasks: [
      { id: 'task-8', title: 'Integrasi dengan API pembayaran pihak ketiga', tags: ['API', 'Bantuan'] },
    ],
  },
};

const faqData = [
    { q: 'Bagaimana cara membuat proyek baru?', a: 'Klik tombol "My Project" di sidebar, lalu cari tombol "+ Proyek Baru" di halaman proyek. Anda akan diminta untuk mengisi nama dan deskripsi proyek.' },
    { q: 'Bisakah saya mengundang anggota tim ke proyek saya?', a: 'Tentu saja. Di dalam setiap halaman proyek, ada tab "Anggota". Dari sana, Anda dapat mengundang pengguna lain melalui email mereka.' },
    { q: 'Bagaimana cara kerja banner tag di profil?', a: 'Banner tag diberikan secara otomatis berdasarkan kontribusi Anda. Misalnya, menyelesaikan sejumlah tugas akan memberi Anda banner "Penyelesai Cepat", dan menjadi kontributor teratas akan memberi Anda banner "Top Kontributor".' },
    { q: 'Apakah data saya aman?', a: 'Kami menggunakan enkripsi standar industri dan praktik keamanan terbaik untuk memastikan data Anda selalu aman dan terlindungi.' },
];


// --- Komponen-Komponen Aplikasi ---

// Komponen untuk Kartu Tugas di Kanban Board
const TaskCard = ({ task }) => (
  <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm mb-3 border-l-4 border-slate-300 dark:border-slate-500 hover:shadow-md transition-shadow cursor-pointer">
    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{task.title}</p>
    <div className="flex flex-wrap gap-1 mt-2">
      {task.tags.map(tag => (
        <span key={tag} className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">{tag}</span>
      ))}
    </div>
    <div className="flex items-center justify-between mt-3">
        <div className="flex -space-x-2">
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-700" src="https://placehold.co/32x32/8B5CF6/FFFFFF?text=S" alt="Sarah" />
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-700" src="https://placehold.co/32x32/FBBF24/FFFFFF?text=B" alt="Budi" />
        </div>
        <MoreHorizontal size={18} className="text-slate-400" />
    </div>
  </div>
);

// Komponen untuk Kolom di Kanban Board
const KanbanColumn = ({ column }) => (
  <div className="bg-slate-100 dark:bg-slate-800/80 rounded-xl p-3 w-full md:w-72 lg:w-80 flex-shrink-0">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${column.color}`}></span>
        <h3 className="font-bold text-slate-800 dark:text-slate-100">{column.name}</h3>
      </div>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md">{column.tasks.length}</span>
    </div>
    <div>
      {column.tasks.map(task => <TaskCard key={task.id} task={task} />)}
    </div>
    <button className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors">
      <Plus size={16} /> Tambah Tugas
    </button>
  </div>
);

// Komponen untuk Pop-up Profil
const ProfileModal = ({ user, onClose }) => {
    const getContributionLevel = (tasks) => {
        if (tasks > 75) return { name: "Master Kontributor", color: "bg-purple-500", icon: <Award size={16}/> };
        if (tasks > 50) return { name: "Penyelesai Cepat", color: "bg-green-500", icon: <Zap size={16}/> };
        if (tasks > 10) return { name: "Kontributor Aktif", color: "bg-blue-500", icon: <BarChart2 size={16}/> };
        return { name: "Pemula", color: "bg-slate-500", icon: <User size={16}/> };
    };
    const contribution = getContributionLevel(user.stats.tasksCompleted);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex flex-col items-center text-center">
                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full ring-4 ring-indigo-300 dark:ring-indigo-500 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{user.title}</p>
                </div>
                <div className="mt-6 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Banner Keunggulan</h3>
                    <div className={`flex items-center gap-3 ${contribution.color} text-white p-3 rounded-lg`}>
                        {contribution.icon}
                        <span className="font-semibold">{contribution.name}</span>
                    </div>
                     {user.stats.topContributorIn > 0 && (
                        <div className="flex items-center gap-3 bg-amber-400 text-slate-800 p-3 rounded-lg">
                            <Award size={16} />
                            <span className="font-semibold">Top Kontributor di {user.stats.topContributorIn} Proyek</span>
                        </div>
                    )}
                </div>
                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Statistik</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-indigo-500 dark:text-indigo-400">{user.stats.tasksCompleted}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tugas Selesai</p>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-indigo-500 dark:text-indigo-400">{user.stats.projectsContributed}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Proyek Aktif</p>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="mt-6 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Tutup
                </button>
            </div>
        </div>
    );
};


// Komponen Halaman: Project (Kanban)
const ProjectView = () => (
  <div className="p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Papan Proyek "QuantumLeap"</h1>
        <button className="mt-3 sm:mt-0 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg">
            <Plus size={18} /> Tambah Proyek
        </button>
    </div>
    <div className="flex gap-6 overflow-x-auto pb-4">
      {Object.values(projectData).map(column => (
        <KanbanColumn key={column.name} column={column} />
      ))}
    </div>
  </div>
);

// Komponen Halaman: Board (Bounty Board)
const BoardView = () => (
    <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Bounty Board</h1>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
            <p className="text-slate-600 dark:text-slate-300">
                Halaman ini akan menampilkan semua tugas ("bounty") dari berbagai proyek yang ditugaskan kepada Anda. Ini membantu Anda fokus pada apa yang perlu dikerjakan selanjutnya tanpa harus berpindah-pindah proyek.
            </p>
            <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200">Contoh Tugas Anda:</h3>
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-500 dark:text-slate-400">
                    <li>[Proyek QuantumLeap] Implementasi komponen Sidebar React</li>
                    <li>[Proyek Phoenix] Desain skema database untuk proyek</li>
                    <li>[Proyek Titan] Integrasi dengan API pembayaran</li>
                </ul>
            </div>
        </div>
    </div>
);

// Komponen Halaman: Schedule
const ScheduleView = () => (
    <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Jadwal</h1>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
                Di sini akan ditampilkan kalender Anda yang terintegrasi dengan Google Calendar. Semua deadline tugas dan acara proyek akan muncul secara otomatis.
            </p>
            <div className="aspect-w-16 aspect-h-9 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <img src="https://placehold.co/800x450/E2E8F0/475569?text=Integrasi+Google+Calendar" alt="Placeholder Kalender" className="rounded-lg" />
            </div>
        </div>
    </div>
);

// Komponen Halaman: FAQ
const FaqView = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Frequently Asked Questions (FAQ)</h1>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 space-y-4">
                {faqData.map((item, index) => (
                    <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-4">
                        <button 
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex justify-between items-center text-left"
                        >
                            <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">{item.q}</span>
                            <ChevronRight size={20} className={`transform transition-transform ${openIndex === index ? 'rotate-90' : ''}`} />
                        </button>
                        {openIndex === index && (
                            <p className="mt-2 text-slate-600 dark:text-slate-300">
                                {item.a}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


// Komponen Sidebar
const Sidebar = ({ user, onPageChange, currentPage, onToggleDarkMode, isDarkMode, onProfileClick, isSidebarOpen, setSidebarOpen }) => {
    const navItems = [
        { name: 'Project', icon: KanbanSquare, page: 'Project' },
        { name: 'My Projects', icon: LayoutDashboard, page: 'Board' },
        { name: 'Inbox', icon: Inbox, page: 'Inbox' },
        { name: 'Settings', icon: Settings, page: 'Settings' },
    ];

    return (
        <div className={`fixed inset-y-0 left-0 z-30 bg-white dark:bg-slate-900 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex flex-col w-64 transition-transform duration-300 ease-in-out`}>
            {/* Header Sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                        <KanbanSquare className="text-white" size={24}/>
                    </div>
                    <span className="text-xl font-bold text-slate-800 dark:text-white">Produktif</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 dark:text-slate-400">
                    <ChevronLeft size={24} />
                </button>
            </div>

            {/* Profil Pengguna */}
            <div className="p-4 mt-4">
                <div 
                    className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    onClick={onProfileClick}
                >
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.title}</p>
                    </div>
                </div>
            </div>

            {/* Navigasi Utama */}
            <nav className="flex-1 px-4 mt-4 space-y-2">
                {navItems.map(item => (
                    <a
                        key={item.name}
                        href="#"
                        onClick={(e) => { e.preventDefault(); onPageChange(item.page); }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                            currentPage === item.page
                                ? 'bg-indigo-500 text-white shadow-md'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.name}</span>
                    </a>
                ))}
            </nav>

            {/* Footer Sidebar */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <button onClick={onToggleDarkMode} className="w-full flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>
        </div>
    );
};

// Komponen Navbar Utama
const TopNavbar = ({ onPageChange, currentPage, onToggleSidebar }) => {
    const navItems = [
        { name: 'Board', icon: LayoutDashboard, page: 'Board' },
        { name: 'Schedule', icon: Calendar, page: 'Schedule' },
        { name: 'Project', icon: KanbanSquare, page: 'Project' },
        { name: 'FAQ', icon: HelpCircle, page: 'FAQ' },
    ];

    return (
        <header className="sticky top-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Tombol Buka Sidebar di Mobile */}
                <button onClick={onToggleSidebar} className="md:hidden text-slate-600 dark:text-slate-300">
                    <ChevronRight size={24} />
                </button>

                {/* Navigasi di Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    {navItems.map(item => (
                        <a
                            key={item.name}
                            href="#"
                            onClick={(e) => { e.preventDefault(); onPageChange(item.page); }}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                currentPage === item.page
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>

                {/* Aksi di Kanan */}
                <div className="flex items-center gap-4">
                    <button className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
                        <Bell size={22} />
                    </button>
                    {/* Placeholder untuk Search Bar */}
                    <div className="hidden sm:block">
                        <input type="text" placeholder="Cari proyek atau tugas..." className="w-48 bg-slate-100 dark:bg-slate-800 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
                    </div>
                </div>
            </div>
        </header>
    );
};


// Komponen Aplikasi Utama
export default function App() {
    const [currentPage, setCurrentPage] = useState('Project');
    const [isDarkMode, setDarkMode] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setSidebarOpen(false); // Tutup sidebar saat navigasi di mobile
    };
    
    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'Board':
                return <BoardView />;
            case 'Schedule':
                return <ScheduleView />;
            case 'FAQ':
                return <FaqView />;
            case 'Project':
            default:
                return <ProjectView />;
        }
    };

    return (
        <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors`}>
            {isProfileOpen && <ProfileModal user={userData} onClose={() => setProfileOpen(false)} />}
            
            <Sidebar 
                user={userData}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                onToggleDarkMode={() => setDarkMode(!isDarkMode)}
                isDarkMode={isDarkMode}
                onProfileClick={() => setProfileOpen(true)}
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavbar 
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    {renderCurrentPage()}
                </main>
            </div>
        </div>
    );
}
