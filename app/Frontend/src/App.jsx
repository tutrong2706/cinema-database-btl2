// ...existing code...
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import LoginPage from './pages/LoginPage'; // Bạn tự tạo trang này nhé
import Navbar from './components/Navbar'; // Bạn tự tạo Navbar đơn giản
import AdminPage from './pages/AdminPage'; // <-- added import
import SearchPage from './pages/SearchPage';
// ...existing code...

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/search" element={<SearchPage />} /> 
            <Route path="/admin" element={<AdminPage />} /> {/* <-- added route */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
// ...existing code...