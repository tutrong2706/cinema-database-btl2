    import { useEffect, useState } from 'react';
    import { Link } from 'react-router-dom';
    import axiosClient from '../api/axiosClient';

    const HomePage = () => {
        const [raps, setRaps] = useState([]);
        const [selectedRap, setSelectedRap] = useState(null);
        const [phims, setPhims] = useState([]);
        const [keyword, setKeyword] = useState(''); // Thêm state tìm kiếm

        // 1. Lấy danh sách Rạp
        useEffect(() => {
            axiosClient.get('/auth/raps').then(res => {
                const listRaps = res.data.meta;
                setRaps(listRaps);
                if (listRaps.length > 0) setSelectedRap(listRaps[0].MaRapPhim);
            });
        }, []);

        // 2. Lấy phim khi Rạp thay đổi
        useEffect(() => {
            if (keyword.trim()) {
                // Gọi API tìm kiếm công khai
                axiosClient.get(`/auth/phims/search?keyword=${keyword}`)
                    .then(res => setPhims(res.data.meta))
                    .catch(err => setPhims([]));
            } else if (selectedRap) {
                // Logic cũ: Load theo rạp
                axiosClient.get(`/auth/raps/${selectedRap}/phims`)
                    .then(res => setPhims(res.data.meta))
                    .catch(err => setPhims([]));
            }
        }, [selectedRap, keyword]);

        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-yellow-500">Phim Đang Chiếu</h1>
                    
                    {/* Ô Tìm Kiếm cho Khách */}
                    <input 
                        type="text" 
                        placeholder="Tìm tên phim..." 
                        className="p-2 rounded bg-gray-800 text-white border border-gray-600 w-64"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                
                {/* Chỉ hiện danh sách Rạp khi KHÔNG tìm kiếm */}
                {!keyword && (
                    <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                        {raps.map(rap => (
                            <button
                                key={rap.MaRapPhim}
                                onClick={() => setSelectedRap(rap.MaRapPhim)}
                                className={`px-4 py-2 rounded whitespace-nowrap ${
                                    selectedRap === rap.MaRapPhim ? 'bg-red-600' : 'bg-gray-700'
                                }`}
                            >
                                {rap.Ten}
                            </button>
                        ))}
                    </div>
                )}

                {/* Danh sách Phim */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {phims.map(phim => (
                        <div key={phim.MaPhim} className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition">
                            <img src={phim.Anh || "https://via.placeholder.com/300x450"} alt={phim.TenPhim} className="w-full h-64 object-cover"/>
                            <div className="p-4">
                                <h3 className="font-bold text-lg truncate">{phim.TenPhim}</h3>
                                <p className="text-sm text-gray-400">{phim.ThoiLuong} phút</p>
                                <Link 
                                    to={`/movie/${phim.MaPhim}`} 
                                    className="block mt-3 text-center bg-red-600 py-2 rounded hover:bg-red-700"
                                >
                                    Xem Chi Tiết
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    export default HomePage;