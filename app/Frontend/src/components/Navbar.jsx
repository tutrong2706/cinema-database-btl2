import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 shadow-md mb-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-red-600 tracking-wider">
                    VSE CINEMA
                </Link>
                
                <div className="flex gap-6 items-center">
                    <Link to="/" className="hover:text-red-500 transition">Trang Chủ</Link>
                    
                    {token ? (
                        <div className="flex items-center gap-4">
                            <span className="text-yellow-400 text-sm">
                                Xin chào, {user.email || 'Khách'}
                            </span>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 text-sm transition"
                            >
                                Đăng Xuất
                            </button>
                        </div>
                    ) : (
                        <Link 
                            to="/login" 
                            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Đăng Nhập
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;