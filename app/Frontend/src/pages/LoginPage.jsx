import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post('/auth/login', {
                email,
                password
            });
            
            if (res.data.code === 200) {
                // Lưu token và thông tin user vào localStorage
                localStorage.setItem('token', res.data.meta.token);
                localStorage.setItem('user', JSON.stringify(res.data.meta.userInfo));
                
                alert('Đăng nhập thành công!');
                navigate('/');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Đăng Nhập</h2>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input 
                        type="email" 
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="a@example.com"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Mật khẩu</label>
                    <input 
                        type="password" 
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="passA"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold"
                >
                    Đăng Nhập
                </button>
            </form>
        </div>
    );
};

export default LoginPage;