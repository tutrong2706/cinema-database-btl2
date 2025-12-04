import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        axiosClient.get(`/auth/phims/${id}`).then(res => {
            setMovie(res.data.meta);
        });
    }, [id]);

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="flex flex-col md:flex-row gap-8 mt-24 px-4 container mx-auto pb-10">
            <div className="w-full md:w-1/3">
                <img 
                    src={movie.Anh && movie.Anh.startsWith('http') ? movie.Anh : "https://via.placeholder.com/300x450?text=No+Image"} 
                    className="w-full rounded-lg shadow-2xl border border-gray-800 object-cover"
                    alt={movie.TenPhim}
                />
            </div>
            <div className="flex-1 text-gray-300">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">{movie.TenPhim}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-6 text-sm md:text-base">
                    <p><strong className="text-[#00E5FF]">Đạo diễn:</strong> {movie.DaoDien || 'Đang cập nhật'}</p>
                    <p><strong className="text-[#00E5FF]">Diễn viên:</strong> {movie.DienVienChinh || 'Đang cập nhật'}</p>
                    <p><strong className="text-[#00E5FF]">Quốc gia:</strong> {movie.QuocGia || 'Đang cập nhật'}</p>
                    <p><strong className="text-[#00E5FF]">Khởi chiếu:</strong> {movie.NgayKhoiChieu ? new Date(movie.NgayKhoiChieu).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    <p><strong className="text-[#00E5FF]">Thời lượng:</strong> {movie.ThoiLuong} phút</p>
                    <p><strong className="text-[#00E5FF]">Ngôn ngữ:</strong> {movie.NgonNgu || 'Phụ đề tiếng Việt'}</p>
                    <p><strong className="text-[#00E5FF]">Độ tuổi:</strong> <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">{movie.DoTuoi}+</span></p>
                    <p><strong className="text-[#00E5FF]">Thể loại:</strong> {movie.TheLoai && movie.TheLoai.length > 0 ? movie.TheLoai.join(', ') : 'Chưa cập nhật'}</p>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-2 border-l-4 border-[#00E5FF] pl-3">NỘI DUNG PHIM</h3>
                    <p className="leading-relaxed text-gray-400 text-justify">{movie.MoTa || "Chưa có mô tả cho phim này."}</p>
                </div>
                
                <Link 
                    to={`/booking/${movie.MaPhim}`} 
                    className="inline-block bg-gradient-to-r from-[#00E5FF] to-[#00cce6] text-black px-10 py-4 rounded-xl font-bold text-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] transition transform hover:-translate-y-1"
                >
                    🎟 ĐẶT VÉ NGAY
                </Link>

                <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">Đánh giá từ khán giả</h3>
                    {movie.DanhGia && movie.DanhGia.length > 0 ? (
                        <div className="space-y-4">
                            {movie.DanhGia.map(dg => (
                                <div key={dg.MaDanhGia} className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">U</div>
                                            <span className="font-bold text-gray-300">Khán giả</span>
                                        </div>
                                        <span className="text-gray-500 text-xs">{new Date(dg.NgayDang).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(10)].map((_, i) => (
                                            <span key={i} className={`text-sm ${i < dg.DiemSo ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                                        ))}
                                        <span className="ml-2 text-yellow-400 font-bold text-sm">{dg.DiemSo}/10</span>
                                    </div>
                                    <p className="text-gray-400 text-sm italic">"{dg.NoiDung}"</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;