import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const BookingPage = () => {
    const { id: MaPhim } = useParams(); // Lấy MaPhim từ URL
    const navigate = useNavigate();

    // State cho các bước chọn
    const [raps, setRaps] = useState([]);
    const [selectedRap, setSelectedRap] = useState('');
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
        if (!selectedRap || !ngayChieu) return;
        
        axiosClient.get('/auth/suat-chieus', {
            params: { MaRapPhim: selectedRap, MaPhim, NgayChieu: ngayChieu }
        })
        .then(res => setSuatChieus(res.data.meta))
        .catch(() => setSuatChieus([])); // Không tìm thấy suất
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
            setSelectedSeats([...selectedSeats, { HangGhe: row, SoGhe: num }]);
        }
    };

    // 4. Chuyển sang trang thanh toán
    const handleConfirm = () => {
        if (!selectedSuat || selectedSeats.length === 0) return alert("Vui lòng chọn suất và ghế!");
        
        // Lưu tạm vào localStorage để trang Payment lấy ra dùng
        const bookingData = {
            suatChieu: selectedSuat,
            seats: selectedSeats,
            totalPrice: selectedSeats.length * selectedSuat.GiaVeCoBan // Tạm tính
        };
        localStorage.setItem('bookingTemp', JSON.stringify(bookingData));
        navigate('/payment');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Đặt Vé Xem Phim</h2>

            {/* Bước 1: Chọn Rạp & Ngày */}
            <div className="bg-gray-800 p-4 rounded mb-6 flex gap-4">
                <select 
                    className="bg-gray-700 p-2 rounded flex-1"
                    onChange={(e) => setSelectedRap(e.target.value)}
                >
                    <option value="">-- Chọn Rạp --</option>
                    {raps.map(r => <option key={r.MaRapPhim} value={r.MaRapPhim}>{r.Ten}</option>)}
                </select>
                <input 
                    type="date" 
                    className="bg-gray-700 p-2 rounded"
                    value={ngayChieu}
                    onChange={(e) => setNgayChieu(e.target.value)}
                />
                <button onClick={handleFindSuatChieu} className="bg-blue-600 px-4 rounded">Tìm Suất</button>
            </div>

            {/* Bước 2: Chọn Suất Chiếu */}
            {suatChieus.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl mb-3">Chọn Giờ Chiếu:</h3>
                    <div className="flex gap-3">
                        {suatChieus.map(sc => (
                            <button
                                key={sc.MaSuatChieu}
                                onClick={() => { setSelectedSuat(sc); setSelectedSeats([]); }}
                                className={`px-4 py-2 rounded border ${
                                    selectedSuat?.MaSuatChieu === sc.MaSuatChieu 
                                    ? 'bg-green-600 border-green-600' 
                                    : 'border-gray-500 hover:bg-gray-700'
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
                <div className="bg-gray-800 p-6 rounded text-center">
                    <div className="w-full bg-gray-500 h-2 mb-8 rounded">MÀN HÌNH</div>
                    
                    <div className="flex flex-col gap-2 items-center">
                        {rows.map(row => (
                            <div key={row} className="flex gap-2">
                                {Array.from({ length: seatsPerRow }).map((_, i) => {
                                    const num = i + 1;
                                    const isSelected = selectedSeats.some(s => s.HangGhe === row && s.SoGhe === num);
                                    return (
                                        <button
                                            key={`${row}${num}`}
                                            onClick={() => toggleSeat(row, num)}
                                            className={`w-10 h-10 rounded text-sm font-bold ${
                                                isSelected ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'
                                            }`}
                                        >
                                            {row}{num}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 border-t border-gray-600 pt-4 flex justify-between items-center">
                        <div>
                            <p>Ghế chọn: {selectedSeats.map(s => `${s.HangGhe}${s.SoGhe}`).join(', ')}</p>
                            <p className="text-xl font-bold text-yellow-400">
                                Tổng tiền: {(selectedSeats.length * selectedSuat.GiaVeCoBan).toLocaleString()} VNĐ
                            </p>
                        </div>
                        <button 
                            onClick={handleConfirm}
                            className="bg-red-600 px-8 py-3 rounded font-bold hover:bg-red-700"
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