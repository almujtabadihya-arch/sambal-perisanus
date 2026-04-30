import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import OrderTracking from './pages/OrderTracking';
import Admin from './pages/Admin';

export const AppContext = createContext();

function App() {
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.includes('/admin');
  
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 100);
    const finishTimer = setTimeout(() => setLoading(false), 2000);
    return () => { clearTimeout(timer); clearTimeout(finishTimer); };
  }, []);

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sambalUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, qty: Math.max(1, p.qty + delta) };
      }
      return p;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('sambalUser', JSON.stringify(userData));
    navigate('/checkout');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sambalUser');
  };

  return (
    <AppContext.Provider value={{
      cart, addToCart, isCartOpen, setIsCartOpen, updateQty, removeFromCart, user, login, logout, setCart
    }}>
      {loading && (
        <div className="splash-screen">
          <div className="splash-logo">SAMBAL PERISA</div>
          <div className="splash-loading">
            <div className="splash-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <p style={{ marginTop: '1.5rem', letterSpacing: '4px', fontSize: '0.9rem', opacity: 0.8, fontWeight: '600' }}>PREMIUM CRAFTED</p>
        </div>
      )}
      
      {!isAdminPage && <div className="body-watermark"></div>}
      {!isAdminPage && <Navbar />}
      
      <main className={isAdminPage ? "" : "container"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/lacak" element={<OrderTracking />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
      {isCartOpen && <CartSidebar />}
      {!isAdminPage && <ChatWidget />}
    </AppContext.Provider>
  );
}

export default App;
