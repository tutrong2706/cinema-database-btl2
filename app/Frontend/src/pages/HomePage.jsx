import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [phims, setPhims] = useState([]);
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const navigate = useNavigate();
    const DEFAULT_BANNER = 'https://via.placeholder.com/1920x550?text=MOVIE+HUB';

    // Search State
    const [keyword, setKeyword] = useState('');
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState('');
    const [nowShowingPhims, setNowShowingPhims] = useState([]);
    const [topTrendingPhims, setTopTrendingPhims] = useState([]);



    useEffect(() => {
        // axiosClient.get('/auth/phims/search?keyword=') 
        //     .then(res => {
        //         const list = res.data.meta || [];
        //         setPhims(list);
        //         if (list.length > 0) {
        //             // Đảm bảo URL ảnh của phim nổi bật hợp lệ
        //             const featured = list[0];
        //             if (featured.Anh && typeof featured.Anh === 'string' && featured.Anh.startsWith('http')) {
        //                 setFeaturedMovie(featured);
        //             } else {
        //                 setFeaturedMovie({...featured, Anh: DEFAULT_BANNER}); // Gán ảnh mặc định nếu URL không hợp lệ
        //             }
        //         }
        //     })
        //     .catch(err => console.log(err));
            axiosClient.get('/auth/dang-chieu')
                    .then(res => {
        const nowShowing = res.data.meta || res.data || [];
        setNowShowingPhims(nowShowing);
    })
    .catch(err => console.log('Error fetching now showing movies:', err));
     axiosClient.get('/auth/sorted-by-rating')
        .then(res => {
           const topMovies = res.data.data || [];
            setTopTrendingPhims(topMovies);
        })
        .catch(err => console.log('Error fetching top trending movies:', err));
    }, []);

      const handleSearch = () => {
    const params = {};
    if (keyword.trim()) params.tenPhim = keyword.trim();
    if (genre && genre !== '') params.theLoai = genre;
    if (year && year !== '') params.nam = year;
    
    // ✅ Encode params đúng cách
    const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
    
    navigate(`/search?${queryString}`);
};
    
    // Lấy URL banner cuối cùng
    const bannerUrl = featuredMovie?.Anh || DEFAULT_BANNER;
    // Lấy khoảng 3 phim để hiển thị ở mục "Phim Đang Chiếu"
    const showingPhims = phims.slice(0, 3);

    return (
        <div className="min-h-screen bg-gray-950 pb-20">
            
            {/* --- 1. HERO BANNER --- */}
            <div className="relative w-full h-[600px] flex items-center justify-center bg-black/80 -mt-[80px]">
                {/* Image & Gradient Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
                    style={{ backgroundImage: `url(${bannerUrl})` }}
                >
                    {/* Darker Overlay */}
                    <div className="absolute inset-0 bg-black/60"></div>
                    {/* Gradient Fade to Background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
                </div>

                <div className="relative z-10 text-center px-4 w-full max-w-5xl mt-16">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tighter animate-fadeIn">
                        KHÁM PHÁ THẾ GIỚI ĐIỆN ẢNH
                    </h1>
                    <p className="text-gray-300 text-xl mb-12 font-light drop-shadow-lg">
                        Nơi tổng hợp hàng ngàn bộ phim chất lượng cao.
                    </p>

                    {/* --- 2. GLASS SEARCH BAR --- */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 mx-auto max-w-4xl">
                        <input 
                            type="text" 
                            placeholder="Nhập tên phim..." 
                            className="flex-1 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 px-3 py-3 focus:outline-none focus:border-[#00E5FF] transition rounded-t-lg"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        
                        <select 
                            className="bg-transparent border-b-2 border-gray-600 text-gray-300 px-3 py-3 focus:outline-none focus:border-[#00E5FF] cursor-pointer md:w-40 appearance-none rounded-t-lg"
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            <option value="" className="bg-gray-900 text-white">Tất cả thể loại</option>
                            <option value="Hành động" className="bg-gray-900 text-white">Hành động</option>
                            <option value="Tình cảm" className="bg-gray-900 text-white">Tình cảm</option>
                            {/* Thêm các thể loại khác tại đây */}
                        </select>

                        <select 
                            className="bg-transparent border-b-2 border-gray-600 text-gray-300 px-3 py-3 focus:outline-none focus:border-[#00E5FF] cursor-pointer md:w-32 appearance-none rounded-t-lg"
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option value="" className="bg-gray-900 text-white">Tất cả năm</option>
                            <option value="2024" className="bg-gray-900 text-white">2024</option>
                            <option value="2023" className="bg-gray-900 text-white">2023</option>
                            {/* Thêm các năm khác tại đây */}
                        </select>

                        <button 
                            onClick={handleSearch}
                            className="bg-[#00E5FF] hover:bg-[#00cce6] text-black font-extrabold px-8 py-3 rounded-xl transition transform hover:scale-[1.02] shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            TÌM KIẾM
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 3. SECTIONS (SLIDER) --- */}
            <div className="container mx-auto px-6 py-16 space-y-20">
                
                {/* Section: Phim Đang Chiếu */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-extrabold text-white border-l-4 border-[#00E5FF] pl-4">
                            PHIM ĐANG CHIẾU 🔥
                        </h2>
                        <button className="text-gray-400 hover:text-[#00E5FF] text-sm font-medium transition flex items-center gap-1">
                            Xem tất cả 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                    {/* Horizontal Scroll Container */}
                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
                         {nowShowingPhims.length > 0 ? ( 
                            nowShowingPhims.map(phim => (
                            <div key={phim.MaPhim} className="snap-center">
                                    <MovieCard movie={phim} />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center w-full py-8">
                                    Đang tải phim đang chiếu...
                                </p>
                            )}
                    </div>
                </div>

                {/* Section: Top Trending */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-extrabold text-white border-l-4 border-yellow-500 pl-4">
                            TOP TRENDING 🏆
                        </h2>
                        <select className="bg-gray-800 border border-gray-700 text-xs text-gray-300 rounded px-3 py-2 outline-none cursor-pointer hover:bg-gray-700 transition">
                            <option className="bg-gray-900">Hôm nay</option>
                            <option className="bg-gray-900">Tuần này</option>
                        </select>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
                       {topTrendingPhims.length > 0 ? (  // top trending_______________________
                            topTrendingPhims.map(phim => (
                                <div key={`trend-${phim.MaPhim}`} className="snap-center">
                                    <MovieCard movie={phim} />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center w-full py-8">
                                Đang tải phim xu hướng...
                            </p>
                        )}
                    </div>
                </div>

            </div>

            {/* --- 4. FOOTER --- */}
            <footer className="border-t border-gray-800 bg-[#1a1a1a] py-10 text-center text-gray-500 text-sm mt-10">
                <p>&copy; 2025 **MOVIE HUB** – All rights reserved.</p>
                <p className="mt-2 text-xs">Designed with **React** & **Tailwind CSS** in Dark Mode.</p>
            </footer>
        </div>
    );
};

export default HomePage;