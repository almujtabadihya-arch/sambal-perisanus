import React, { useContext } from 'react';
import { X, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

export default function CartSidebar() {
  const { cart, setIsCartOpen, updateQty, removeFromCart, user } = useContext(AppContext);
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      <div className="cart-sidebar-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Keranjang Saya</h3>
          <button className="qty-btn" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="flex-center text-center" style={{height: '100%', flexDirection: 'column', color: 'var(--text-light)'}}>
              <ShoppingBagIcon />
              <p className="mt-4">Keranjang masih kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">Rp {item.price.toLocaleString('id-ID')}</div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem'}}>
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>-</button>
                      <span style={{fontWeight: 600, width: '20px', textAlign: 'center'}}>{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                    <button style={{background: 'none', border:'none', color: '#F44336', cursor: 'pointer'}} onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <button className="btn btn-primary" style={{width: '100%'}} onClick={handleCheckoutClick}>
              Lanjut ke Pembayaran <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function ShoppingBagIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );
}
