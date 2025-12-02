import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Kiểm tra quyền Admin ngay khi vào trang
    useEffect(() => {
        if (user.role !== 'Admin') {
            alert("Bạn không có quyền truy cập trang này!");
            navigate('/');
        }
    }, []);

    const [phims, setPhims] = useState([]);
    const [keyword, setKeyword] = useState('');

    // Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPhim, setEditingPhim] = useState(null); // null = Add mode
    const [formData, setFormData] = useState({
        MaPhim: '', TenPhim: '', ThoiLuong: 0, NgonNgu: '', QuocGia: '',
        DaoDien: '', DienVienChinh: '', NgayKhoiChieu: '', MoTaNoiDung: '', DoTuoi: 13, ChuDePhim: ''
    });

    // 1. Load danh sách phim (Gọi API Search)
    const fetchPhims = async () => {
        try {
            const res = await axiosClient.get('/admin/phims', { params: { keyword } });
            setPhims(res.data.meta);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPhims();
    }, [keyword]); // Tự động search khi gõ

    // 2. Xử lý Xóa
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa phim này?")) return;
        try {
            await axiosClient.delete(`/admin/phims/${id}`);
            alert("Xóa thành công!");
            fetchPhims();
        } catch (error) {
            alert("Lỗi xóa: " + (error.response?.data?.message || error.message));
        }
    };

    // 3. Xử lý Submit Form (Thêm/Sửa)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPhim) {
                // Update
                await axiosClient.put(`/admin/phims/${editingPhim.MaPhim}`, formData);
                alert("Cập nhật thành công!");
            } else {
                // Create
                await axiosClient.post('/admin/phims', formData);
                alert("Thêm mới thành công!");
            }
            setIsModalOpen(false);
            fetchPhims();
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    const openEdit = (phim) => {
        setEditingPhim(phim);
        setFormData({
            ...phim,
            NgayKhoiChieu: phim.NgayKhoiChieu.split('T')[0] // Format date cho input
        });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingPhim(null);
        setFormData({
            MaPhim: '', TenPhim: '', ThoiLuong: 0, NgonNgu: '', QuocGia: '',
            DaoDien: '', DienVienChinh: '', NgayKhoiChieu: '', MoTaNoiDung: '', DoTuoi: 13, ChuDePhim: ''
        });
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-yellow-500">Quản Lý Phim (Admin)</h1>
                <button onClick={openAdd} className="bg-green-600 px-4 py-2 rounded font-bold hover:bg-green-700">
                    + Thêm Phim Mới
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm phim theo tên..." 
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-yellow-500">
                            <th className="p-3 border-b border-gray-700">Mã</th>
                            <th className="p-3 border-b border-gray-700">Tên Phim</th>
                            <th className="p-3 border-b border-gray-700">Thời Lượng</th>
                            <th className="p-3 border-b border-gray-700">Ngày KC</th>
                            <th className="p-3 border-b border-gray-700">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {phims.map(p => (
                            <tr key={p.MaPhim} className="hover:bg-gray-800">
                                <td className="p-3 border-b border-gray-700">{p.MaPhim}</td>
                                <td className="p-3 border-b border-gray-700 font-bold">{p.TenPhim}</td>
                                <td className="p-3 border-b border-gray-700">{p.ThoiLuong}p</td>
                                <td className="p-3 border-b border-gray-700">{new Date(p.NgayKhoiChieu).toLocaleDateString()}</td>
                                <td className="p-3 border-b border-gray-700 flex gap-2">
                                    <button onClick={() => openEdit(p)} className="bg-blue-600 px-3 py-1 rounded text-sm">Sửa</button>
                                    <button onClick={() => handleDelete(p.MaPhim)} className="bg-red-600 px-3 py-1 rounded text-sm">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">{editingPhim ? 'Cập Nhật Phim' : 'Thêm Phim Mới'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            {/* Các trường input */}
                            <div>
                                <label className="block text-sm text-gray-400">Mã Phim</label>
                                <input required disabled={!!editingPhim} value={formData.MaPhim} onChange={e => setFormData({...formData, MaPhim: e.target.value})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400">Tên Phim</label>
                                <input required value={formData.TenPhim} onChange={e => setFormData({...formData, TenPhim: e.target.value})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400">Thời Lượng (phút)</label>
                                <input type="number" required value={formData.ThoiLuong} onChange={e => setFormData({...formData, ThoiLuong: parseInt(e.target.value)})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400">Ngày Khởi Chiếu</label>
                                <input type="date" required value={formData.NgayKhoiChieu} onChange={e => setFormData({...formData, NgayKhoiChieu: e.target.value})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"/>
                            </div>
                            {/* Thêm các trường khác tương tự: NgonNgu, QuocGia, DaoDien... */}
                            
                            <div className="col-span-2 flex justify-end gap-4 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 rounded">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 rounded font-bold">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;