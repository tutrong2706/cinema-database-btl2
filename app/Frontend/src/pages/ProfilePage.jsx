import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [profileRes, historyRes] = await Promise.all([
                    axiosClient.get('/auth/profile'),
                    axiosClient.get('/user/history')
                ]);
                
                setProfile(profileRes.data.meta);
                setHistory(historyRes.data.meta);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

                    {/* Transaction History */}
                    <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 mb-8 border border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Lịch Sử Giao Dịch</h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {history.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">Chưa có giao dịch nào.</p>
                            ) : (
                                history.map((order) => (
                                    <div key={order.MaDonHang} className="bg-gray-700/50 rounded-xl p-5 border border-gray-600 hover:border-[#00E5FF] transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-[#00E5FF] font-bold text-lg">#{order.MaDonHang}</p>
                                                <p className="text-gray-400 text-sm">{new Date(order.ThoiGianDat).toLocaleString('vi-VN')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-bold text-xl">{parseInt(order.TongTien).toLocaleString('vi-VN')} đ</p>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                                                    order.TrangThai === 'Đã thanh toán' ? 'bg-green-500/20 text-green-400' :
                                                    order.TrangThai === 'Hủy' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {order.TrangThai}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Tickets */}
                                        {order.ve_xem_phim && order.ve_xem_phim.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-gray-300 font-semibold text-sm mb-2">Vé xem phim:</p>
                                                <div className="space-y-2">
                                                    {order.ve_xem_phim.map((ve, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm bg-gray-800/50 p-2 rounded">
                                                            <div>
                                                                <p className="text-white font-medium">{ve.suat_chieu?.phim?.TenPhim}</p>
                                                                <p className="text-gray-400 text-xs">
                                                                    {ve.suat_chieu?.phong_chieu?.rap_chieu_phim?.Ten} - {ve.suat_chieu?.phong_chieu?.Ten}
                                                                </p>
                                                                <p className="text-gray-400 text-xs">
                                                                    Ghế: {ve.HangGhe}{ve.SoGhe}
                                                                </p>
                                                                {ve.ap_dung && (
                                                                    <p className="text-green-400 text-xs mt-1">
                                                                        Mã giảm: {ve.ap_dung.chuong_trinh_khuyen_mai?.TenChuongTrinh} (-{parseInt(ve.ap_dung.chuong_trinh_khuyen_mai?.MucGiam).toLocaleString('vi-VN')}đ)
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-300">{parseInt(ve.GiaVeCuoi).toLocaleString('vi-VN')} đ</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Items */}
                                        {order.gom && order.gom.length > 0 && (
                                            <div>
                                                <p className="text-gray-300 font-semibold text-sm mb-2">Đồ ăn & Thức uống:</p>
                                                <div className="space-y-2">
                                                    {order.gom.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm bg-gray-800/50 p-2 rounded">
                                                            <p className="text-white">{item.mat_hang?.TenHang} x{item.SoLuong}</p>
                                                            <p className="text-gray-300">{parseInt(item.DonGia * item.SoLuong).toLocaleString('vi-VN')} đ</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
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
