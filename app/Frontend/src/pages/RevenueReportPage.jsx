import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';

const RevenueReportPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Kiểm tra quyền Admin
    useEffect(() => {
        if (user.role !== 'Admin') {
            alert("Bạn không có quyền truy cập báo cáo doanh thu!");
            navigate('/');
        }
    }, [user.role, navigate]);

    // Fetch báo cáo doanh thu
    useEffect(() => {
        const fetchRevenueReport = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get('/admin/revenue-report');
                setData(response.data.meta || []);
                setError(null);
            } catch (err) {
                setError("Lỗi khi tải báo cáo doanh thu: " + (err.response?.data?.message || err.message));
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        if (user.role === 'Admin') {
            fetchRevenueReport();
        }
    }, [user.role]);

    // Tính toán thống kê
    const totalRevenue = data.reduce((sum, item) => sum + (item.TongDoanhThu || 0), 0);
    const totalTickets = data.reduce((sum, item) => sum + (item.SoVeDaBan || 0), 0);
    const avgRevenue = data.length > 0 ? Math.round(totalRevenue / data.length) : 0;

    // Màu sắc cho biểu đồ
    const COLORS = ['#00E5FF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E5FF]"></div>
                    <p className="mt-4 text-gray-400">Đang tải báo cáo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-24 px-6 pb-10">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-white border-l-4 border-[#00E5FF] pl-4 mb-2">
                         BÁO CÁO DOANH THU PHIM
                    </h1>
                    <p className="text-gray-400 text-sm ml-4">
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Thống kê tổng quát */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#00E5FF] to-cyan-500 rounded-lg p-6 shadow-lg">
                        <p className="text-gray-900 text-sm font-semibold">TỔNG DOANH THU</p>
                        <p className="text-2xl font-extrabold text-gray-900 mt-2">
                            {(totalRevenue / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tr
                        </p>
                        <p className="text-xs text-gray-700 mt-1">Tất cả phim</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg p-6 shadow-lg">
                        <p className="text-gray-900 text-sm font-semibold">TỔNG VÉ ĐÃ BÁN</p>
                        <p className="text-2xl font-extrabold text-gray-900 mt-2">
                            {totalTickets.toLocaleString('vi-VN')} Vé
                        </p>
                        <p className="text-xs text-gray-700 mt-1">Đã thanh toán</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg p-6 shadow-lg">
                        <p className="text-gray-900 text-sm font-semibold">DOANH THU TB/PHIM</p>
                        <p className="text-2xl font-extrabold text-gray-900 mt-2">
                            {(avgRevenue / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tr
                        </p>
                        <p className="text-xs text-gray-700 mt-1">Trung bình cộng</p>
                    </div>
                </div>

                {/* Biểu đồ Cột - Doanh thu theo phim */}
                <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 shadow-lg mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">💰 Doanh Thu Theo Phim</h2>
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis 
                                    dataKey="TenPhim" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={100}
                                    tick={{ fill: '#999', fontSize: 12 }}
                                />
                                <YAxis tick={{ fill: '#999' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #00E5FF', borderRadius: '8px' }}
                                    formatter={(value) => [(value / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' Tr', 'Doanh thu']}
                                    labelStyle={{ color: '#00E5FF' }}
                                />
                                <Legend />
                                <Bar dataKey="TongDoanhThu" fill="#00E5FF" name="Doanh Thu" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-10">Không có dữ liệu</p>
                    )}
                </div>

                {/* Biểu đồ Hình Tròn - Tỷ lệ doanh thu */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">🥧 Tỷ Lệ Doanh Thu Các Phim</h2>
                        {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ TenPhim, percent }) => `${TenPhim.substring(0, 10)}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="TongDoanhThu"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #00E5FF', borderRadius: '8px' }}
                                        formatter={(value) => [(value / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' Tr']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400 text-center py-10">Không có dữ liệu</p>
                        )}
                    </div>

                    {/* Biểu đồ Cột - Số vé bán */}
                    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">🎫 Số Vé Đã Bán Theo Phim</h2>
                        {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis 
                                        dataKey="TenPhim" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={80}
                                        tick={{ fill: '#999', fontSize: 11 }}
                                    />
                                    <YAxis tick={{ fill: '#999' }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #FFE66D', borderRadius: '8px' }}
                                        formatter={(value) => [value, 'Số vé']}
                                    />
                                    <Bar dataKey="SoVeDaBan" fill="#FFE66D" name="Số Vé" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400 text-center py-10">Không có dữ liệu</p>
                        )}
                    </div>
                </div>

                {/* Bảng chi tiết */}
                <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 shadow-lg">
                    <h2 className="text-xl font-bold text-white p-6 border-b border-gray-800">📋 Chi Tiết Báo Cáo</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th className="px-6 py-4 text-xs text-gray-400 font-semibold uppercase">Mã Phim</th>
                                    <th className="px-6 py-4 text-xs text-gray-400 font-semibold uppercase">Tên Phim</th>
                                    <th className="px-6 py-4 text-xs text-gray-400 font-semibold uppercase text-right">Số Vé Bán</th>
                                    <th className="px-6 py-4 text-xs text-gray-400 font-semibold uppercase text-right">Doanh Thu</th>
                                    <th className="px-6 py-4 text-xs text-gray-400 font-semibold uppercase text-right">Giá Bình Quân</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {data && data.map((item, idx) => {
                                    const soVe = item?.SoVeDaBan ?? 0;
                                    const doanhThu = item?.TongDoanhThu ?? 0;
                                    const avgPrice = soVe > 0 ? Math.round(doanhThu / soVe) : 0;
                                    return (
                                        <tr key={idx} className="hover:bg-gray-800/50 transition">
                                            <td className="px-6 py-4 text-gray-400 font-mono text-sm">{item?.MaPhim || 'N/A'}</td>
                                            <td className="px-6 py-4 font-bold text-white">{item?.TenPhim || 'N/A'}</td>
                                            <td className="px-6 py-4 text-right text-amber-400 font-semibold">
                                                {soVe.toLocaleString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 text-right text-[#00E5FF] font-bold">
                                                {(doanhThu / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tr
                                            </td>
                                            <td className="px-6 py-4 text-right text-purple-400 font-semibold">
                                                {(avgPrice / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} K
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueReportPage;
