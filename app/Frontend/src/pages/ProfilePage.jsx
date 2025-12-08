import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get('/auth/profile');
                setProfile(response.data.meta);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Lỗi khi tải thông tin cá nhân');
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-400">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-red-500">{error}</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-400">Không có dữ liệu</div>
            </div>
        );
    }

    // Gán rank color dựa vào LoaiThanhVien
    const getRankColor = (rank) => {
        switch (rank) {
            case 'Platinum':
                return 'from-purple-500 to-pink-500';
            case 'Gold':
                return 'from-yellow-500 to-orange-500';
            case 'Silver':
                return 'from-gray-400 to-gray-300';
            case 'Bronze':
            default:
                return 'from-amber-700 to-orange-700';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-20">
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white mb-2">Hồ Sơ Cá Nhân</h1>
                        <p className="text-gray-400">Quản lý thông tin tài khoản của bạn</p>
                    </div>

                    {/* Avatar & Name */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-8 mb-8 border border-gray-700">
                        <div className="flex flex-col items-center mb-8">
                            {/* Avatar */}
                            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getRankColor(profile.LoaiThanhVien)} flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-6`}>
                                {profile.HoTen?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            
                            {/* Name */}
                            <h2 className="text-3xl font-bold text-white mb-2">{profile.HoTen}</h2>
                            
                            {/* Rank Badge */}
                            <span className={`inline-block px-6 py-2 rounded-full font-bold text-white bg-gradient-to-r ${getRankColor(profile.LoaiThanhVien)} shadow-lg`}>
                                {profile.LoaiThanhVien} Member
                            </span>
                        </div>

                        {/* Points Section */}
                        <div className="bg-gray-700/50 rounded-2xl p-6 mt-8 border border-gray-600">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Điểm Tích Lũy</p>
                                    <p className="text-3xl font-bold text-[#00E5FF]">{profile.DiemTichLuy.toLocaleString()}</p>
                                </div>
                                <div className="text-5xl">⭐</div>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Email */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-[#00E5FF] transition">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3"></span>
                                <label className="text-sm text-gray-400 font-semibold">Email</label>
                            </div>
                            <p className="text-white text-lg break-all">{profile.Email}</p>
                        </div>
                        {/* Phone */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-[#00E5FF] transition">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3"></span>
                                <label className="text-sm text-gray-400 font-semibold">Số Điện Thoại</label>
                            </div>
                            <p className="text-white text-lg">{profile.SDT || 'Chưa cập nhật'}</p>
                        </div>
                        {/* Address */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-[#00E5FF] transition md:col-span-2">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3"></span>
                                <label className="text-sm text-gray-400 font-semibold">Địa Chỉ</label>
                            </div>
                            <p className="text-white text-lg">{profile.DiaChi || 'Chưa cập nhật'}</p>
                        </div>

                        {/* Gender */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-[#00E5FF] transition">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3"></span>
                                <label className="text-sm text-gray-400 font-semibold">Giới Tính</label>
                            </div>
                            <p className="text-white text-lg">
                                {profile.GioiTinh === 'M' ? 'Nam' : profile.GioiTinh === 'F' ? 'Nữ' : 'Chưa cập nhật'}
                            </p>
                        </div>

                        {/* Member ID */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-[#00E5FF] transition">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3"></span>
                                <label className="text-sm text-gray-400 font-semibold">ID Thành Viên</label>
                            </div>
                            <p className="text-white text-lg font-mono">{profile.MaNguoiDung}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 !bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition transform hover:scale-105"
                        >
                            ← Quay Lại
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                navigate('/login');
                            }}
                            className="px-8 py-3 !bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition transform hover:scale-105"
                        >
                            Đăng Xuất
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
