import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const BookingPage = () => {
    const { id: MaPhim } = useParams();
    const navigate = useNavigate();

    // State cho các bước chọn
    const [raps, setRaps] = useState([]);
    const [selectedRap, setSelectedRap] = useState('');
    // Đảm bảo NgayChieu là chuỗi YYYY-MM-DD
    const [ngayChieu, setNgayChieu] = useState(new Date().toISOString().split('T')[0]); 
    const [suatChieus, setSuatChieus] = useState([]);
    const [selectedSuat, setSelectedSuat] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

    // 1. Load danh sách rạp để chọn
    useEffect(() => {
        axiosClient.get('/auth/raps').then(res => setRaps(res.data.meta));
    }, []);

    // 2. Tìm suất chiếu khi chọn Rạp + Ngày
    const handleFindSuatChieu = () => {
        if (!selectedRap || !ngayChieu) return alert("Vui lòng chọn Rạp và Ngày Chiếu!");
        
        // Reset Suất và Ghế khi tìm kiếm suất mới
        setSelectedSuat(null);
        setSelectedSeats([]);

        axiosClient.get('/auth/suat-chieus', {
            params: { MaRapPhim: selectedRap, MaPhim, NgayChieu: ngayChieu }
        })
        .then(res => {
            if (res.data.meta && res.data.meta.length > 0) {
                setSuatChieus(res.data.meta);
            } else {
                setSuatChieus([]);
                alert("Không tìm thấy suất chiếu nào phù hợp.");
            }
        })
        .catch(error => {
            console.error(error);
            setSuatChieus([]);
            alert("Lỗi khi tìm suất chiếu.");
        });
    };

    // 3. Xử lý chọn ghế (Giả lập sơ đồ ghế 5 hàng x 8 ghế)
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 8;

    const toggleSeat = (row, num) => {
        const seatId = `${row}${num}`;
        const isSelected = selectedSeats.some(s => s.HangGhe === row && s.SoGhe === num);
        
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => !(s.HangGhe === row && s.SoGhe === num)));
        } else {
            // Giới hạn số lượng ghế có thể chọn (ví dụ: tối đa 8 ghế)
            if (selectedSeats.length >= 8) return alert("Chỉ có thể chọn tối đa 8 ghế cho một lần đặt!");
            setSelectedSeats([...selectedSeats, { HangGhe: row, SoGhe: num }]);
        }
    };

    // 4. Chuyển sang trang thanh toán
    const handleConfirm = () => {
        if (!selectedSuat) return alert("Vui lòng chọn suất chiếu!");
        if (selectedSeats.length === 0) return alert("Vui lòng chọn ít nhất một ghế!");
        
        // Lưu tạm vào localStorage để trang Payment lấy ra dùng
        const bookingData = {
            suatChieu: selectedSuat,
            seats: selectedSeats.sort((a, b) => a.HangGhe.localeCompare(b.HangGhe) || a.SoGhe - b.SoGhe),
            totalPrice: selectedSeats.length * selectedSuat.GiaVeCoBan
        };
        localStorage.setItem('bookingTemp', JSON.stringify(bookingData));
        navigate('/payment');
    };

    return (
        <div className="max-w-5xl mx-auto pt-24 pb-10 px-4">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-[#00E5FF] border-b border-gray-700 pb-3">ĐẶT VÉ XEM PHIM</h2>

            {/* Bước 1: Chọn Rạp & Ngày */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <label className="text-gray-300 font-semibold md:w-1/4">Chọn Rạp/Ngày:</label>
                <select 
                    className="bg-gray-800 p-3 rounded-lg flex-1 border border-gray-700 text-white focus:border-[#00E5FF] outline-none"
                    onChange={(e) => setSelectedRap(e.target.value)}
                    value={selectedRap}
                >
                    <option value="" className="bg-gray-900">-- Chọn Rạp --</option>
                    {raps.map(r => <option key={r.MaRapPhim} value={r.MaRapPhim} className="bg-gray-900">{r.Ten}</option>)}
                </select>
                <input 
                    type="date" 
                    className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-white focus:border-[#00E5FF] outline-none md:w-auto"
                    value={ngayChieu}
                    onChange={(e) => setNgayChieu(e.target.value)}
                />
                <button 
                    onClick={handleFindSuatChieu} 
                    className="bg-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition md:w-auto w-full"
                >
                    Tìm Suất
                </button>
            </div>

            {/* Bước 2: Chọn Suất Chiếu */}
            {suatChieus.length > 0 && (
                <div className="mb-10 bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
                    <h3 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Chọn Giờ Chiếu (Phòng):</h3>
                    <div className="flex flex-wrap gap-4">
                        {suatChieus.map(sc => (
                            <button
                                key={sc.MaSuatChieu}
                                onClick={() => { setSelectedSuat(sc); setSelectedSeats([]); }}
                                className={`px-5 py-2 rounded-lg font-semibold transition text-sm ${
                                    selectedSuat?.MaSuatChieu === sc.MaSuatChieu 
                                    ? 'bg-green-600 text-white shadow-md shadow-green-600/40 border-green-600' 
                                    : 'bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300'
                                }`}
                            >
                                {sc.GioBatDau.substring(0, 5)} - {sc.phong_chieu.Ten}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Bước 3: Chọn Ghế (Chỉ hiện khi đã chọn suất) */}
            {selectedSuat && (
                <div className="bg-gray-900 p-8 rounded-xl text-center shadow-2xl border border-gray-800">
                    <h3 className="text-xl font-bold mb-6 text-white">Sơ Đồ Ghế Ngồi: {selectedSuat.phong_chieu.Ten}</h3>

                    {/* Màn Hình */}
                    <div className="w-full bg-gray-700/50 text-gray-400 py-2 mb-10 rounded-t-xl border-b-4 border-gray-500 font-bold uppercase tracking-wider">
                        MÀN HÌNH
                    </div>
                    
                    {/* Sơ đồ Ghế */}
                    <div className="flex flex-col gap-3 items-center">
                        {rows.map(row => (
                            <div key={row} className="flex gap-2 items-center">
                                <span className="w-6 text-left text-sm font-bold text-gray-400">{row}</span>
                                {Array.from({ length: seatsPerRow }).map((_, i) => {
                                    const num = i + 1;
                                    const isSelected = selectedSeats.some(s => s.HangGhe === row && s.SoGhe === num);
                                    
                                    // Tạm thời giả định Ghế A1, B5, C8, D2 là đã Bán
                                    const isSold = (row === 'A' && num === 1) || (row === 'B' && num === 5) || (row === 'C' && num === 8) || (row === 'D' && num === 2);

                                    return (
                                        <button
                                            key={`${row}${num}`}
                                            onClick={() => !isSold && toggleSeat(row, num)}
                                            disabled={isSold}
                                            className={`w-10 h-10 rounded-md text-sm font-bold border ${
                                                isSold ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500' 
                                                : isSelected ? 'bg-red-600 text-white border-red-700 hover:bg-red-700 shadow-md shadow-red-600/40' 
                                                : 'bg-gray-300 text-black border-gray-400 hover:bg-gray-200'
                                            } transition duration-150`}
                                        >
                                            {num}
                                        </button>
                                    );
                                })}
                                <span className="w-6 text-right text-sm font-bold text-gray-400">{row}</span>
                            </div>
                        ))}
                    </div>

                    {/* Chú thích */}
                    <div className="flex justify-center gap-8 mt-8 text-sm">
                        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-gray-300 border"></span> Ghế trống</div>
                        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-red-600"></span> Đang chọn</div>
                        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-gray-600"></span> Đã bán</div>
                    </div>

                    {/* Tóm tắt & Thanh toán */}
                    <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-left mb-4 sm:mb-0">
                            <p className="text-gray-300 text-sm">Ghế chọn: <span className="font-bold text-white">{selectedSeats.map(s => `${s.HangGhe}${s.SoGhe}`).join(', ') || "Chưa chọn"}</span></p>
                            <p className="text-xl font-extrabold text-[#00E5FF] mt-1">
                                Tổng tiền: <span className="text-yellow-400">{(selectedSeats.length * selectedSuat.GiaVeCoBan).toLocaleString()} VNĐ</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Giá vé cơ bản: {selectedSuat.GiaVeCoBan.toLocaleString()} VNĐ/ghế</p>
                        </div>
                        <button 
                            onClick={handleConfirm}
                            disabled={selectedSeats.length === 0}
                            className={`px-10 py-3 rounded-xl font-bold transition text-lg ${
                                selectedSeats.length > 0 
                                ? 'bg-[#00E5FF] text-black hover:bg-[#00cce6] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            TIẾP TỤC THANH TOÁN
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingPage;