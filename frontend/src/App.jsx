import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import AdminDisputeDashboard from './pages/AdminDisputeDashboard';
import ThreeDBackground from './components/ThreeDBackground';
import LiveTrainBoard from './pages/LiveTrainBoard';
import Booking from './pages/Booking';
import MiniWallet from './components/MiniWallet';
import Health from './pages/Health';
import WalletPage from './pages/Wallet';
import Profile from './pages/Profile';
import VendorDashboard from './pages/VendorDashboard';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <Router>
      <ThreeDBackground />
      <MiniWallet />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/travel/trains/live" element={<LiveTrainBoard />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/disputes" element={<AdminDisputeDashboard />} />
          <Route path="/health" element={<Health />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vendor" element={<VendorDashboard />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
