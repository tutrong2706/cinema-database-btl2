import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [bookingInfo, setBookingInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (orderId) {
                // Trường hợp thanh toán lại đơn hàng cũ
                try {
                    const res = await axiosClient.get(`/auth/orders/${orderId}`);
                    const data = res.data.meta;
                    
                    // Map dữ liệu từ API về format của trang Payment
                    setBookingInfo({
                        MaDonHang: data.MaDonHang,
                        suatChieu: data.suatChieu,
                        seats: data.seats,
                        combos: data.combos,
                        totalPrice: data.TongTien,
                        isExistingOrder: true,
                        status: data.TrangThai
                    });
                } catch (error) {
                    alert("Không tìm thấy đơn hàng!");
                    navigate('/');
                }
            } else {
                // Trường hợp đặt mới từ localStorage
                const data = localStorage.getItem('bookingTemp');
                if (data) {
                    setBookingInfo({ ...JSON.parse(data), isExistingOrder: false });
                } else {
                    navigate('/');
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [orderId, navigate]);

    const handlePayment = async () => {
        try {
            if (bookingInfo.isExistingOrder) {
                // Thanh toán đơn hàng cũ
                await axiosClient.post(`/auth/orders/${bookingInfo.MaDonHang}/pay`);
                alert("Thanh toán thành công!");
                navigate('/profile');
            } else {
                // Tạo đơn hàng mới và thanh toán luôn
                const payload = {
                    MaSuatChieu: bookingInfo.suatChieu.MaSuatChieu,
                    MaPhong: bookingInfo.suatChieu.MaPhong,
                    DanhSachGhe: bookingInfo.seats,
                    DanhSachCombo: bookingInfo.combos ? bookingInfo.combos.map(c => ({ MaHang: c.MaHang, SoLuong: c.SoLuong })) : [],
                    isPayLater: false
                };
                const res = await axiosClient.post('/auth/booking', payload);
                if (res.data.code === 200) {
                    alert(`Đặt vé thành công! Mã đơn: ${res.data.meta.MaDonHang}`);
                    localStorage.removeItem('bookingTemp');
                    navigate('/profile');
                }
            }
        } catch (error) {
            alert("Lỗi thanh toán: " + (error.response?.data?.message || error.message));
        }
    };

    const handlePayLater = async () => {
        if (bookingInfo.isExistingOrder) {
            navigate('/profile'); // Đã tồn tại rồi thì chỉ cần quay về
            return;
        }

        try {
            const payload = {
                MaSuatChieu: bookingInfo.suatChieu.MaSuatChieu,
                MaPhong: bookingInfo.suatChieu.MaPhong,
                DanhSachGhe: bookingInfo.seats,
                DanhSachCombo: bookingInfo.combos ? bookingInfo.combos.map(c => ({ MaHang: c.MaHang, SoLuong: c.SoLuong })) : [],
                isPayLater: true
            };
            const res = await axiosClient.post('/auth/booking', payload);
            if (res.data.code === 200) {
                alert(`Đã tạo đơn hàng! Vui lòng thanh toán sau. Mã đơn: ${res.data.meta.MaDonHang}`);
                localStorage.removeItem('bookingTemp');
                navigate('/profile');
            }
        } catch (error) {
            alert("Lỗi tạo đơn: " + (error.response?.data?.message || error.message));
        }
    };

    const handleCancel = async () => {
        if (!bookingInfo.isExistingOrder) {
            if (window.confirm("Bạn có chắc muốn hủy đặt vé này?")) {
                localStorage.removeItem('bookingTemp');
                navigate('/');
            }
            return;
        }

        if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
            try {
                await axiosClient.post(`/auth/orders/${bookingInfo.MaDonHang}/cancel`);
                alert("Đã hủy đơn hàng!");
                navigate('/profile');
            } catch (error) {
                alert("Lỗi hủy đơn: " + (error.response?.data?.message || error.message));
            }
        }
    };

    if (loading || !bookingInfo) return <div className="text-white text-center mt-20">Loading...</div>;

    // Nếu đơn hàng đã thanh toán hoặc hủy, không cho thao tác nữa
    if (bookingInfo.isExistingOrder && bookingInfo.status !== 'Chờ thanh toán') {
        return (
            <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg mt-10 text-center">
                <h2 className={`text-3xl font-bold mb-6 ${bookingInfo.status === 'Hủy' ? 'text-red-500' : 'text-green-500'}`}>
                    Đơn hàng {bookingInfo.status}
                </h2>
                <button onClick={() => navigate('/profile')} className="bg-gray-600 px-6 py-2 rounded text-white">Quay lại</button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-500">
                {bookingInfo.isExistingOrder ? 'Thanh Toán Đơn Hàng' : 'Xác Nhận Đặt Vé'}
            </h2>
            
            <div className="space-y-4 text-lg text-gray-300">
                <p><strong>Phim:</strong> {bookingInfo.suatChieu.phim.TenPhim}</p>
                <p><strong>Rạp:</strong> {bookingInfo.suatChieu.phong_chieu?.Ten || bookingInfo.suatChieu.phong_chieu?.TenRapPhim || 'Rạp'}</p>
                <p><strong>Suất chiếu:</strong> {bookingInfo.suatChieu.GioBatDau} - {bookingInfo.suatChieu.NgayChieu ? new Date(bookingInfo.suatChieu.NgayChieu).toLocaleDateString('vi-VN') : ''}</p>
                <p><strong>Ghế:</strong> {bookingInfo.seats.map(s => `${s.HangGhe}${s.SoGhe}`).join(', ')}</p>
                
                {bookingInfo.combos && bookingInfo.combos.length > 0 && (
                    <div className="mt-2">
                        <strong>Combo:</strong>
                        <ul className="list-disc list-inside pl-4 text-gray-400 text-sm mt-1">
                            {bookingInfo.combos.map(c => (
                                <li key={c.MaHang}>{c.TenHang} x {c.SoLuong} ({Number(c.DonGia).toLocaleString()} đ)</li>
                            ))}
                        </ul>
                    </div>
                )}

                <hr className="border-gray-600"/>
                <p className="text-2xl font-bold text-right text-yellow-400">
                    Tổng cộng: {Number(bookingInfo.totalPrice).toLocaleString()} VNĐ
                </p>
            </div>

            <div className="flex flex-col gap-3 mt-8">
                <button 
                    onClick={handlePayment}
                    className="w-full bg-green-600 py-3 rounded font-bold text-xl hover:bg-green-700 text-white transition"
                >
                    THANH TOÁN NGAY
                </button>
                
                <div className="flex gap-3">
                    {!bookingInfo.isExistingOrder && (
                        <button 
                            onClick={handlePayLater}
                            className="flex-1 bg-yellow-600 py-3 rounded font-bold text-white hover:bg-yellow-700 transition"
                        >
                            THANH TOÁN SAU
                        </button>
                    )}
                    <button 
                        onClick={handleCancel}
                        className="flex-1 bg-red-600 py-3 rounded font-bold text-white hover:bg-red-700 transition"
                    >
                        HỦY BỎ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;