import { Link } from 'react-router-dom';

const DEFAULT_POSTER = "https://via.placeholder.com/300x450?text=No+Image";

const MovieCard = ({ movie }) => {
    // Thêm logic kiểm tra URL ảnh hợp lệ
    const imageUrl = movie.Anh && typeof movie.Anh === 'string' && movie.Anh.startsWith('http') 
        ? movie.Anh 
        : DEFAULT_POSTER;

    return (
        <div className="flex-none w-[160px] md:w-[200px] group relative rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300 hover:z-10 transform hover:-translate-y-1">
            {/* Poster */}
            <div className="aspect-[2/3] overflow-hidden rounded-xl bg-gray-800">
                <img 
                    // Sử dụng imageUrl đã kiểm tra
                    src={imageUrl} 
                    alt={movie.TenPhim} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    // Xử lý lỗi: nếu ảnh vẫn lỗi, quay về placeholder
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = DEFAULT_POSTER;
                    }}
                />
            </div>

            {/* Overlay thông tin khi hover */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 rounded-xl p-2">
                <Link 
                    to={`/movie/${movie.MaPhim}`}
                    className="bg-[#00E5FF] text-black px-4 py-2 rounded-full font-bold text-sm transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-white shadow-lg"
                >
                    Chi tiết
                </Link>
                <div className="text-center px-2 w-full">
                    <p className="text-white font-extrabold text-base truncate">{movie.TenPhim}</p>
                    <p className="text-yellow-400 text-sm font-bold mt-1">⭐ {movie.DiemDanhGia || 'N/A'}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{new Date(movie.NgayKhoiChieu).getFullYear()}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;