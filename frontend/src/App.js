
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from './componenets/ProductDetails';
import Cart from './pages/Cart';  
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import {ProtectedRoute,AdminRoute} from './componenets/ProtectedRoute';  
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/AdminDashboard';
import GoogleSuccess from './pages/GoogleSuccess';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';  
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import WhatsAppFloat from './componenets/WhatsAppFloat';
function App() {
  return (
    <BrowserRouter>
    <WhatsAppFloat /> {/* FLOATING WHATSAPP BUTTON */}
       {/* ✅ GLOBAL TOAST (PLACE HERE) */}
      <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        theme="light"
      />
      <Routes>
        
        <Route path="/" element={<Home />} />
        {/* Product Details Page */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path ="/cart" element={<Cart />} />
      
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order/:id" element={<OrderDetails />} />
       
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/profile" element={<Profile/>} />
        <Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>  
  }
/>

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

   <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
