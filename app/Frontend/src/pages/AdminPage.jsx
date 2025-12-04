import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const DEFAULT_POSTER = 'https://via.placeholder.com/40x56?text=N/A'; // Placeholder cho Admin

    useEffect(() => {
        // ... (Giữ nguyên logic kiểm tra quyền) ...
        if (user.role !== 'Admin') {
            alert("Bạn không có quyền truy cập trang này!");
            navigate('/');
        }
    }, []);

    const [phims, setPhims] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPhim, setEditingPhim] = useState(null);
    const [formData, setFormData] = useState({
        MaPhim: '', TenPhim: '', ThoiLuong: 0, NgonNgu: '', QuocGia: '',
        DaoDien: '', DienVienChinh: '', NgayKhoiChieu: '', MoTaNoiDung: '', DoTuoi: 13, ChuDePhim: '', Anh: ''
    });

    const fetchPhims = async () => {
        try {
            // Hiển thị loading state (Nếu có)
            const res = await axiosClient.get('/admin/phims', { params: { keyword } });
            setPhims(res.data.meta);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchPhims(); }, [keyword]);

    // ... (Giữ nguyên handleDelete và handleSubmit) ...
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa phim này?")) return;
        try {
            await axiosClient.delete(`/admin/phims/${id}`);
            alert("Xóa thành công!");
            fetchPhims();
        } catch (error) { 
            alert("Lỗi: Không thể xóa Phim này. Phim vẫn còn suất chiếu chưa diễn ra hoặc đang chờ/mở."); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Chuyển đổi các trường số sang number
            const dataToSubmit = {
                ...formData,
                ThoiLuong: parseInt(formData.ThoiLuong),
                DoTuoi: parseInt(formData.DoTuoi)
            };

            if (editingPhim) await axiosClient.put(`/admin/phims/${editingPhim.MaPhim}`, dataToSubmit);
            else await axiosClient.post('/admin/phims', dataToSubmit);
            
            alert(editingPhim ? "Cập nhật thành công!" : "Thêm mới thành công!");
            setIsModalOpen(false);
            fetchPhims();
        } catch (error) { 
            console.error(error);
            alert("Lỗi: " + (error.response?.data?.message || error.message)); 
        }
    };

    const openEdit = (phim) => {
        // ... (Giữ nguyên logic) ...
        setEditingPhim(phim);
        setFormData({ ...phim, NgayKhoiChieu: phim.NgayKhoiChieu.split('T')[0] });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingPhim(null);
        // Cài đặt giá trị mặc định cho form thêm mới
        setFormData({
            MaPhim: 'PH888', 
            TenPhim: '3 heo con', 
            ThoiLuong: 90, // Mặc định 90 phút
            NgonNgu: 'Tiếng Việt', // Mặc định Tiếng Việt
            QuocGia: 'Việt Nam', // Mặc định Việt Nam
            DaoDien: 'Trọngbro', 
            DienVienChinh: 'Thốngbro', 
            NgayKhoiChieu: new Date().toISOString().split('T')[0], // Mặc định là ngày hôm nay
            MoTaNoiDung: 'Phim hay', 
            DoTuoi: 13, // Mặc định 13+
            ChuDePhim: 'Hành động', // Mặc định thể loại
            Anh: 'https://i.pinimg.com/564x/d3/d4/19/d3d419e944662ef50d5de9216a06b82c.jpg'
        });
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-950 pt-24 px-6 pb-10">
            <div className="container mx-auto">
                {/* Header Admin */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-extrabold text-white border-l-4 border-[#00E5FF] pl-4">QUẢN LÝ PHIM</h1>
                    <div className="flex gap-3">
                        <button onClick={openAdd} className="bg-[#00E5FF] text-black px-5 py-2 rounded-lg font-bold hover:bg-[#00cce6] transition shadow-lg">
                            + Thêm Phim Mới
                        </button>
                        <button onClick={fetchPhims} className="bg-gray-800 text-white px-5 py-2 rounded-lg font-bold hover:bg-gray-700 transition border border-gray-600">
                            🔄 Refresh
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên phim...." 
                        className="w-full p-4 rounded-xl bg-[#1a1a1a] text-white border border-gray-700 focus:border-[#00E5FF] outline-none transition placeholder-gray-500"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-[#1a1a1a] rounded-xl overflow-x-auto border border-gray-800 shadow-2xl">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Mã</th>
                                <th className="p-4 font-semibold">Poster</th>
                                <th className="p-4 font-semibold">Tên Phim</th>
                                <th className="p-4 font-semibold">Năm</th>
                                <th className="p-4 font-semibold">Thời Lượng</th>
                                <th className="p-4 font-semibold">Rating</th>
                                <th className="p-4 font-semibold text-right">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {phims.map(p => (
                                <tr key={p.MaPhim} className="hover:bg-gray-800/50 transition">
                                    <td className="p-4 text-gray-400 font-mono text-xs">{p.MaPhim}</td>
                                    <td className="p-4">
                                        <img 
                                            src={p.Anh && typeof p.Anh === 'string' && p.Anh.startsWith('http') ? p.Anh : DEFAULT_POSTER} 
                                            alt={p.TenPhim} 
                                            className="w-10 h-14 object-cover rounded bg-gray-700 border border-gray-600"
                                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_POSTER; }}
                                        />
                                    </td>
                                    <td className="p-4 font-bold text-white max-w-[200px] truncate">{p.TenPhim}</td>
                                    <td className="p-4 text-gray-300">{new Date(p.NgayKhoiChieu).getFullYear()}</td>
                                    <td className="p-4 text-gray-300">{p.ThoiLuong}p</td>
                                    <td className="p-4 text-yellow-400 font-bold">★ {p.DiemDanhGia || 'N/A'}</td>
                                    <td className="p-4 flex justify-end gap-2 whitespace-nowrap">
                                        <button onClick={() => openEdit(p)} className="bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white px-3 py-1 rounded transition text-sm font-semibold">Sửa</button>
                                        <button onClick={() => handleDelete(p.MaPhim)} className="bg-red-600/30 text-red-300 hover:bg-red-600 hover:text-white px-3 py-1 rounded transition text-sm font-semibold">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form (Đã tối ưu style) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-2xl border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-3">{editingPhim ? 'Chỉnh Sửa Phim' : 'Thêm Phim Mới'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Input Fields (Đã sắp xếp lại và tối ưu style) */}
                            {['MaPhim', 'TenPhim', 'ThoiLuong', 'NgonNgu', 'QuocGia', 'DaoDien', 'DienVienChinh', 'DoTuoi', 'ChuDePhim'].map((field) => (
                                <div key={field}>
                                    <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">{field}</label>
                                    <input 
                                        type={field === 'ThoiLuong' || field === 'DoTuoi' ? 'number' : 'text'}
                                        required={field !== 'MaPhim' || editingPhim} /* Bắt buộc trừ MaPhim khi chỉnh sửa */
                                        disabled={field === 'MaPhim' && !!editingPhim}
                                        value={formData[field]} 
                                        onChange={e => setFormData({...formData, [field]: e.target.value})} 
                                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                    />
                                </div>
                            ))}
                            {/* NgayKhoiChieu nằm riêng để đảm bảo loại 'date' */}
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">Ngày Khởi Chiếu</label>
                                <input 
                                    type="date" 
                                    required 
                                    value={formData.NgayKhoiChieu} 
                                    onChange={e => setFormData({...formData, NgayKhoiChieu: e.target.value})} 
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">URL Ảnh Poster</label>
                                <input 
                                    type="text" 
                                    value={formData.Anh} 
                                    onChange={e => setFormData({...formData, Anh: e.target.value})} 
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition" 
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">Mô Tả Nội Dung</label>
                                <textarea 
                                    rows="4" 
                                    value={formData.MoTaNoiDung} 
                                    onChange={e => setFormData({...formData, MoTaNoiDung: e.target.value})} 
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                ></textarea>
                            </div>

                            <div className="col-span-2 flex justify-end gap-4 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-semibold">Hủy</button>
                                <button type="submit" className="px-6 py-2 bg-[#00E5FF] text-black font-bold rounded-lg hover:bg-[#00cce6] shadow-lg">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;