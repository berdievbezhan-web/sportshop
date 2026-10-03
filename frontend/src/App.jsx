import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders';
import StockRequestForm from './pages/StockRequestForm';
import AdminLayout from './admin/AdminLayout';
import AdminProducts from './admin/AdminProducts';
import ProductForm from './admin/ProductForm';
import AdminOrders from './admin/AdminOrders';
import AdminRequests from './admin/AdminRequests';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog/:category" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/request" element={<StockRequestForm />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="requests" element={<AdminRequests />} />
          </Route>
        </Routes>
      </div>
      <footer className="bg-brand text-gray-400 text-center py-6 text-sm mt-10">
        © {new Date().getFullYear()} SPORTFORM — мужская спортивная одежда
      </footer>
    </div>
  );
}
