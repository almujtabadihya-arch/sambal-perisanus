import React, { useState, createContext, useContext, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.includes('/admin');
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 50);
    const finishTimer = setTimeout(() => setLoading(false), 1500);
    return () => { clearTimeout(timer); clearTimeout(finishTimer); };
  }, []);

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sambalUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = Math.max(1, p.qty + delta);
        return { ...p, qty: newQty };
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
    navigate('/');
  };

  return (
    <AppContext.Provider value={{
      cart, addToCart, updateQty, removeFromCart, isCartOpen, setIsCartOpen, user, login, logout, setCart
    }}>
      {loading && (
        <div className="splash-screen" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '8px', marginBottom: '1.5rem' }}>SAMBAL PERISA</div>
          <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--primary)', width: `${progress}%`, transition: '0.5s' }}></div>
          </div>
        </div>
      )}
      
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
