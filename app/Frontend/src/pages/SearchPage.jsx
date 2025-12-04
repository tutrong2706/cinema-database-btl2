import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import MovieCard from '../components/MovieCard';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false); // ✅ Thêm loading state
    
    // State form
    const [formData, setFormData] = useState({
        tenPhim: searchParams.get('tenPhim') || '',
        theLoai: searchParams.get('theLoai') || '',
        nam: searchParams.get('nam') || '',
        minRating: 0,
        sortBy: 'TenPhim'
    });

    const handleSearch = async () => {
        try {
            setLoading(true); // ✅ Bắt đầu loading
            
            // Tạo object params chỉ với những field có giá trị
            const params = {};
            if (formData.tenPhim) params.tenPhim = formData.tenPhim;
            if (formData.theLoai) params.theLoai = formData.theLoai;
            if (formData.nam) params.nam = formData.nam;
            if (formData.minRating > 0) params.minRating = formData.minRating;
            
            // Gọi API /auth/phims/filter
            const res = await axiosClient.get('/auth/fillter', { params });
            setResults(res.data.meta || res.data || []);
        } catch (error) {
            console.error(error);
            setResults([]);
        } finally {
            setLoading(false); // ✅ Kết thúc loading
        }
    };

    // ✅ CHỈ search khi URL params thay đổi
    useEffect(() => {
        const tenPhim = searchParams.get('tenPhim');
        const theLoai = searchParams.get('theLoai');
        const nam = searchParams.get('nam');
        
        // Cập nhật form data từ URL
        setFormData({
            tenPhim: tenPhim || '',
            theLoai: theLoai || '',
            nam: nam || '',
            minRating: 0,
            sortBy: 'TenPhim'
        });
        
        // Chỉ search nếu có ít nhất 1 param
        if (tenPhim || theLoai || nam) {
            handleSearch();
        }
    }, [searchParams]); // ✅ Dependency rõ ràng

    return (
        <div className="bg-gray-900 min-h-screen pt-24 pb-10 px-4">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">
                    Tìm Kiếm Nâng Cao
                </h1>

                {/* Form Tìm Kiếm */}
                <div className="bg-gray-800 p-6 rounded-xl mb-10 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Tên phim</label>
                            <input 
                                type="text" 
                                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                                value={formData.tenPhim}
                                onChange={e => setFormData({...formData, tenPhim: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Điểm đánh giá (Min)</label>
                            <input 
                                type="number" 
                                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                                value={formData.minRating}
                                onChange={e => setFormData({...formData, minRating: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Sắp xếp theo</label>
                            <select 
                                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                                value={formData.sortBy}
                                onChange={e => setFormData({...formData, sortBy: e.target.value})}
                            >
                                <option value="TenPhim">Tên phim (A-Z)</option>
                                <option value="NamSanXuat">Năm sản xuất</option>
                                <option value="DiemDanhGia">Điểm đánh giá</option>
                            </select>
                        </div>
                    </div>
                    <button 
                        onClick={handleSearch}
                        disabled={loading} // ✅ Disable khi đang loading
                        className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 rounded transition"
                    >
                        {loading ? 'ĐANG TÌM...' : 'TÌM KIẾM'}
                    </button>
                </div>

                {/* Kết quả */}
                {loading ? (
                    <p className="text-center text-gray-400">Đang tải...</p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            {results.map(phim => (
                                <MovieCard key={phim.MaPhim} movie={phim} />
                            ))}
                        </div>
                        {results.length === 0 && (
                            <p className="text-center text-gray-500">Không tìm thấy phim nào.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchPage;