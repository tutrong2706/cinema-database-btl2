import { Link } from 'react-router-dom';

const DEFAULT_POSTER = "https://via.placeholder.com/300x450?text=No+Image";

const MovieCard = ({ movie, variant = 'small' }) => {
    // Thêm logic kiểm tra URL ảnh hợp lệ
    const imageUrl = movie.Anh && typeof movie.Anh === 'string' && movie.Anh.startsWith('http') 
        ? movie.Anh 
        : DEFAULT_POSTER;
    const isLarge = variant === 'large';

    const containerClass = isLarge
        ? 'flex-none w-[200px] md:w-[260px] group relative rounded-xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300 hover:z-10'
        : 'flex-none w-[120px] md:w-[160px] group relative rounded-xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300 hover:z-10';

    const titleClass = isLarge ? 'text-white font-extrabold text-sm truncate' : 'text-white font-bold text-sm truncate';
    const ratingClass = isLarge ? 'text-yellow-400 text-sm font-bold mt-2' : 'text-yellow-400 text-xs font-semibold mt-1';

    return (
        <div className={containerClass}>
            {/* Poster */}
            <div className={isLarge ? 'aspect-[2/3] overflow-hidden rounded-xl bg-gray-800' : 'aspect-[2/3] overflow-hidden rounded-xl bg-gray-800'}>
                <img 
                    src={imageUrl} 
                    alt={movie.TenPhim} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_POSTER; }}
                />
            </div>

            {/* Info below poster: title + rating */}
            <div className={isLarge ? 'mt-3 text-center px-1' : 'mt-2 text-center'}>
                <p className={titleClass}>{movie.TenPhim}</p>
                <p className={ratingClass}>⭐ {movie.DiemDanhGia ?? 'N/A'}</p>
            </div>

            {/* Hover action */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 rounded-xl">
                <Link 
                    to={`/movie/${movie.MaPhim}`}
                    className="bg-[#00E5FF] text-black px-3 py-1 rounded-full font-bold text-xs transform scale-95 group-hover:scale-100 transition-transform duration-200 hover:bg-white shadow-lg"
                >
                    Chi tiết
                </Link>
            </div>
        </div>
    );
};

export default MovieCard;