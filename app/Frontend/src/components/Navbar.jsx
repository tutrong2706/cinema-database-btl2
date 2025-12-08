import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'Admin';
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setShowDropdown(false);
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#141414]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* 1. LOGO */}
                <Link to="/" className="flex items-center gap-2">
                    <img 
                      src="/happycinema.png"
                      alt="HappyCinema Logo" 
                      className="h-10 w-auto" 
                    />
                    <span className="text-2xl font-extrabold tracking-wider text-[#00E5FF] hover:text-white transition duration-300">
                        HappyCinema
                    </span>
                </Link>
                
                {/* 2. MENU */}
                <div className="hidden md:flex items-center gap-8 font-medium text-gray-300">
                    <Link to="/" className="hover:text-[#00E5FF] transition">Home</Link>
                    <Link to="/search" className="hover:text-[#00E5FF] transition">Tìm kiếm nâng cao</Link>
                </div>

                {/* 3. USER INFO */}
                <div className="flex items-center gap-6">
                    {isAdmin && (
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/admin" className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition border border-gray-600">
                                <span>⚙️ Chỉnh sửa phim</span>
                            </Link>
                            <Link to="/revenue-report" className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition border border-gray-600">
                                <span>📊 Báo cáo doanh thu</span>
                            </Link>
                        </div>
                    )}

                    {token ? (
                        <div className="flex items-center gap-4 relative">
                            <div 
                                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                    {user.hoTen ? user.hoTen.charAt(0) : 'U'}
                                </div>
                                <span className="hidden sm:block text-sm font-semibold text-gray-200">
                                    {user.hoTen}
                                </span>
                                {/* Dropdown Icon */}
                                <span className={`text-gray-400 transition transform ${showDropdown ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </div>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden w-56 z-50">
                                    <div className="px-4 py-3 border-b border-gray-700">
                                        <p className="text-white font-semibold">{user.hoTen}</p>
                                        <p className="text-gray-400 text-xs">{user.email}</p>
                                    </div>
                                    
                                    <button
                                        onClick={handleProfileClick}
                                        className="w-full text-left px-4 py-3 !bg-black text-white hover:bg-gray-800 hover:text-[#00E5FF] transition flex items-center gap-3"
                                    >
                                        <span className="text-lg">👤</span>
                                        Trang Cá Nhân
                                    </button>

                                    <div className="border-t border-gray-700 mt-2 pt-2">
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setShowDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-3 !bg-black text-white hover:bg-red-900 hover:text-red-500 transition flex items-center gap-3"   
                                        >
                                            {/* Icon Đăng Xuất - Thay emoji bằng SVG */}
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
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                                                />
                                            </svg>
                                            Đăng Xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link 
                            to="/login" 
                            className="bg-[#00E5FF] hover:bg-[#00cce6] text-black px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)] transition transform hover:scale-105"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;