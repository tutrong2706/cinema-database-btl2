import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [bookingInfo, setBookingInfo] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('bookingTemp');
        if (data) setBookingInfo(JSON.parse(data));
        else navigate('/');
    }, []);

    const handlePayment = async () => {
        try {
            const payload = {
                MaSuatChieu: bookingInfo.suatChieu.MaSuatChieu,
                MaPhong: bookingInfo.suatChieu.MaPhong,
                DanhSachGhe: bookingInfo.seats
            };

            // Gọi API đặt vé
            const res = await axiosClient.post('/auth/booking', payload);
            
            if (res.data.code === 200) {
                alert(`Đặt vé thành công! Mã đơn: ${res.data.meta.MaDonHang}`);
                localStorage.removeItem('bookingTemp');
                navigate('/');
            }
        } catch (error) {
            alert("Lỗi đặt vé: " + (error.response?.data?.message || error.message));
        }
    };

    if (!bookingInfo) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-500">Xác Nhận Thanh Toán</h2>
            
            <div className="space-y-4 text-lg">
                <p><strong>Phim:</strong> {bookingInfo.suatChieu.phim.TenPhim}</p>
                <p><strong>Rạp:</strong> {bookingInfo.suatChieu.phong_chieu.Ten}</p>
                <p><strong>Suất chiếu:</strong> {bookingInfo.suatChieu.GioBatDau} - {bookingInfo.suatChieu.NgayChieu}</p>
                <p><strong>Ghế:</strong> {bookingInfo.seats.map(s => `${s.HangGhe}${s.SoGhe}`).join(', ')}</p>
                <hr className="border-gray-600"/>
                <p className="text-2xl font-bold text-right text-yellow-400">
                    Tổng cộng: {bookingInfo.totalPrice.toLocaleString()} VNĐ
                </p>
            </div>

            <button 
                onClick={handlePayment}
                className="w-full mt-8 bg-green-600 py-3 rounded font-bold text-xl hover:bg-green-700"
            >
                XÁC NHẬN ĐẶT VÉ
            </button>
        </div>
    );
};

export default PaymentPage;