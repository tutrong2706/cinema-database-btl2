import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'Admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#141414]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* 1. LOGO: Đã thay thế text bằng thẻ <img> */}
                <Link to="/" className="flex items-center gap-2">
                    <img 
                      src="/happycinema.png" // Đường dẫn tới file logo trong thư mục Public
                      alt="HappyCinema Logo" 
                      className="h-10 w-auto" // Điều chỉnh kích thước logo (ví dụ: cao 10 đơn vị)
                    />
                    {/* Giữ lại tên nếu muốn hiển thị cả logo và tên */}
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
                        <Link to="/admin" className="hidden md:flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition border border-gray-600">
                            <span>⚙️ Chỉnh sửa phim</span>
                        </Link>
                    )}

                    {token ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                {/* Avatar Placeholder */}
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                    {user.hoTen ? user.hoTen.charAt(0) : 'U'}
                                </div>
                                <span className="hidden sm:block text-sm font-semibold text-gray-200">
                                    {user.hoTen}
                                </span>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-white text-sm font-medium transition"
                            >
                                Logout
                            </button>
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