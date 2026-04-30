import React, { useContext } from 'react';
import { ShoppingBag, User, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import logoImg from '../assets/Sastramiharja.png';

export default function Navbar() {
  const { cart, setIsCartOpen, user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const hasOrders = JSON.parse(localStorage.getItem('mySambalOrders') || '[]').length > 0;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <img src={logoImg} alt="Logo" />
          <span>Perisa Nusantara</span>
        </div>
        
        <div className="navbar-actions">
          {user ? (
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <span style={{fontWeight: 600}}>Hai, {user.name}</span>
              <button className="btn btn-outline" style={{padding: '0.4rem 1rem', fontSize: '0.8rem'}} onClick={logout}>
                <LogOut size={16} /> Keluar
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" style={{padding: '0.5rem 1.2rem', fontSize: '0.9rem'}} onClick={() => navigate('/auth')}>
              <User size={18} /> Masuk / Daftar
            </button>
          )}

          <div className="cart-icon" onClick={() => navigate('/lacak')} style={{marginRight: '0.5rem', position: 'relative'}} title="Lacak Pesanan">
            <Menu size={28} />
            {hasOrders && <span style={{ position: 'absolute', top: 0, right: 0, background: 'red', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--primary-orange)' }}></span>}
          </div>
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={28} />
            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </div>
        </div>
      </div>
    </nav>
  );
}
