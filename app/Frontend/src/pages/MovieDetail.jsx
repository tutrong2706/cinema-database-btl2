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
        <div className="flex flex-col md:flex-row gap-8 mt-10">
            <img src={movie.Anh || "https://via.placeholder.com/300x450"} className="w-full md:w-1/3 rounded-lg shadow-lg"/>
            <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{movie.TenPhim}</h1>
                <p className="text-gray-300 mb-2"><strong>Thời lượng:</strong> {movie.ThoiLuong} phút</p>
                <p className="text-gray-300 mb-2"><strong>Thể loại:</strong> {movie.TheLoai.join(', ')}</p>
                <p className="text-gray-300 mb-6">{movie.MoTa}</p>
                
                <Link 
                    to={`/booking/${movie.MaPhim}`} 
                    className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-xl hover:bg-red-700"
                >
                    ĐẶT VÉ NGAY
                </Link>

                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">Đánh giá</h3>
                    {movie.DanhGia.map(dg => (
                        <div key={dg.MaDanhGia} className="bg-gray-800 p-3 rounded mb-2">
                            <div className="flex justify-between">
                                <span className="font-bold text-yellow-400">{dg.DiemSo}/10</span>
                                <span className="text-gray-400 text-sm">{new Date(dg.NgayDang).toLocaleDateString()}</span>
                            </div>
                            <p>{dg.NoiDung}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;