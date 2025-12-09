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
            // Tự động thêm @example.com nếu người dùng không nhập
            let submitEmail = email;
            if (!submitEmail.includes('@')) {
                submitEmail += '@example.com';
            }

            const res = await axiosClient.post('/auth/login', {
                email: submitEmail,
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
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] pt-[80px]">
            <form 
                onSubmit={handleLogin} 
                className="bg-gray-900 p-10 rounded-xl shadow-[0_0_40px_rgba(0,229,255,0.1)] w-full max-w-sm border border-gray-800 transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,229,255,0.2)]"
            >
                <h2 className="text-3xl font-extrabold mb-8 text-center text-[#00E5FF]">ĐĂNG NHẬP</h2>
                <div className="mb-5">
                    <label className="block text-gray-400 mb-2 text-sm font-medium">Email</label>
                    <input 
                        type="text" 
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#00E5FF] outline-none transition placeholder-gray-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email hoặc tên người dùng"
                        required
                    />
                </div>
                <div className="mb-8">
                    <label className="block text-gray-400 mb-2 text-sm font-medium">Mật khẩu</label>
                    <input 
                        type="password" 
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#00E5FF] outline-none transition placeholder-gray-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mật khẩu của bạn"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-[#00E5FF] text-black py-3 rounded-xl hover:bg-[#00cce6] transition font-bold text-lg shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                >
                    Đăng Nhập
                </button>
            </form>
        </div>
    );
};

export default LoginPage;