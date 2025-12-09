import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const DEFAULT_POSTER = 'https://via.placeholder.com/40x56?text=N/A';

    // Lấy keyword từ URL nếu có
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [phims, setPhims] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPhims = async (searchKeyword) => {
        setLoading(true);
        try {
            // Gọi API tìm kiếm đa năng (đã được cập nhật ở Backend để tìm theo Tên, Đạo diễn, Năm...)
            const res = await axiosClient.get('/auth/phims/search', { 
                params: { keyword: searchKeyword } 
            });
            // handleSuccessResponse trả về data trong meta hoặc data
            setPhims(res.data.meta || res.data.data || []);
        } catch (error) { 
            console.error(error); 
            setPhims([]);
        } finally {
            setLoading(false);
        }
    };

    // Gọi tìm kiếm khi component mount (nếu có keyword trên URL hoặc mặc định rỗng để lấy tất cả)
    useEffect(() => {
        fetchPhims(keyword);
    }, []); 

    const handleSearch = () => {
        // Cập nhật URL để user có thể share link
        setSearchParams({ keyword });
        fetchPhims(keyword);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleBooking = (id) => {
        navigate(`/movie/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-950 pt-24 px-6 pb-10">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-extrabold text-white border-l-4 border-[#00E5FF] pl-4">TÌM KIẾM PHIM</h1>
                </div>

                {/* Search Input Area */}
                <div className="mb-8 bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 shadow-lg">
                    <div className="flex gap-4 flex-col md:flex-row">
                        <input 
                            type="text" 
                            placeholder="Nhập tên phim, đạo diễn, diễn viên, năm sản xuất (VD: 2024)..." 
                            className="flex-1 p-4 rounded-xl bg-gray-900 text-white border border-gray-700 focus:border-[#00E5FF] outline-none transition placeholder-gray-500"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button 
                            onClick={handleSearch}
                            className="bg-[#00E5FF] text-black px-8 py-4 rounded-xl font-bold hover:bg-[#00cce6] transition shadow-[0_0_15px_rgba(0,229,255,0.4)] whitespace-nowrap"
                        >
                            TÌM KIẾM
                        </button>
                    </div>
                    <p className="text-gray-500 mt-2 text-sm italic">
                        Nhập từ khóa và nhấn Enter hoặc nút TÌM KIẾM để bắt đầu.
                    </p>
                </div>

                {/* Table Results */}
                <div className="bg-[#1a1a1a] rounded-xl overflow-x-auto border border-gray-800 shadow-2xl">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Mã</th>
                                <th className="p-4 font-semibold">Poster</th>
                                <th className="p-4 font-semibold">Tên Phim</th>
                                <th className="p-4 font-semibold">Thông tin</th>
                                <th className="p-4 font-semibold">Năm</th>
                                <th className="p-4 font-semibold">Rating</th>
                                <th className="p-4 font-semibold text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr><td colSpan="7" className="p-8 text-center text-white">Đang tìm kiếm...</td></tr>
                            ) : phims.length > 0 ? (
                                phims.map(p => (
                                    <tr key={p.MaPhim} className="hover:bg-gray-800/50 transition">
                                        <td className="p-4 text-gray-400 font-mono text-xs">{p.MaPhim}</td>
                                        <td className="p-4">
                                            <img 
                                                src={p.Anh && typeof p.Anh === 'string' && p.Anh.startsWith('http') ? p.Anh : DEFAULT_POSTER} 
                                                alt={p.TenPhim} 
                                                className="w-12 h-16 object-cover rounded bg-gray-700 border border-gray-600"
                                                onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_POSTER; }}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-white text-lg">{p.TenPhim}</div>
                                            <div className="text-gray-400 text-xs mt-1">{p.ThoiLuong} phút</div>
                                        </td>
                                        <td className="p-4 text-gray-300 text-sm">
                                            <div className="mb-1"><span className="text-gray-500">Đạo diễn:</span> {p.DaoDien || 'N/A'}</div>
                                            <div><span className="text-gray-500">Quốc gia:</span> {p.QuocGia || 'N/A'}</div>
                                        </td>
                                        <td className="p-4 text-gray-300 font-mono">{new Date(p.NgayKhoiChieu).getFullYear()}</td>
                                        <td className="p-4 text-yellow-400 font-bold text-lg">★ {p.DiemDanhGia || '0.0'}</td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleBooking(p.MaPhim)} 
                                                className="!bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-lg transition text-sm font-bold shadow-lg"
                                            >
                                                ĐẶT VÉ
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <span className="text-4xl mb-2">🎬</span>
                                        <span>Không tìm thấy phim nào phù hợp với từ khóa "{keyword}"</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;