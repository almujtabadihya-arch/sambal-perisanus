import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Banknote, Truck, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { cart, user, setCart } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [locationCoords, setLocationCoords] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    postalCode: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
    if (cart.length === 0 && !orderSuccess) {
      navigate('/');
    }
  }, [user, navigate, cart, orderSuccess]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = 15000; // Flat dummy shipping fee

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setLocationCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
            setFormData(prev => ({
              ...prev,
              address: `Koordinat GPS: ${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)} - (Alamat otomatis terdeteksi via Maps)`
            }));
            setIsLocating(false);
          }, 1000);
        },
        (error) => {
          alert('Gagal mendapatkan lokasi. Silakan isi manual.');
          setIsLocating(false);
        }
      );
    } else {
      alert('Browser tidak mendukung lokasi.');
      setIsLocating(false);
    }
  };

  const handleProcessOrder = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert('Pilih metode pembayaran terlebih dahulu');
      return;
    }
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          totalAmount: total + shipping,
          paymentMethod,
          shippingFee: shipping,
          location: locationCoords
        })
      });
      
      if (!response.ok) throw new Error('Gagal server backend.');
      
      const responseData = await response.json();
      setCreatedOrder(responseData);
      
      const existingOrders = JSON.parse(localStorage.getItem('mySambalOrders') || '[]');
      if (!existingOrders.includes(responseData.orderId)) {
        existingOrders.push(responseData.orderId);
      }
      localStorage.setItem('mySambalOrders', JSON.stringify(existingOrders));

      setOrderSuccess(true);
      setCart([]); // Reset cart
    } catch (err) {
      alert("Terjadi kesalahan koneksi ke server: " + err.message);
    }
  };

  if (orderSuccess) {
    return (
      <div className="flex-center" style={{minHeight: '60vh', flexDirection: 'column', textAlign: 'center', padding: '2rem 1rem'}}>
        <CheckCircle size={80} color="#4CAF50" style={{marginBottom: '1.5rem'}} />
        <h2>Pesanan Berhasil Dibuat!</h2>
        <p style={{color: 'var(--text-light)', maxWidth: '500px', margin: '1rem auto 2rem'}}>
          Terima kasih {formData.name}, pesanan Sambal Perisa Nusantara Anda telah direkam. 
        </p>

        <div style={{background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px dashed #ccc'}}>
          <p style={{margin: '0 0 0.5rem', color: 'var(--text-light)'}}>Simpan Nomor Pesanan (ID) Anda:</p>
          <h1 style={{margin: 0, color: 'var(--primary-red)'}}>{createdOrder?.orderId}</h1>
        </div>

        {createdOrder?.paymentMethod === 'dana' && (
          <div style={{background: '#e3f2fd', border: '2px solid #118ee9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', width: '100%', maxWidth: '500px'}}>
            <h3 style={{color: '#118ee9', margin: '0 0 0.5rem'}}>Pembayaran Otomatis DANA</h3>
            <p>Silakan segera lakukan transfer DANA sebesar <strong>Rp {createdOrder?.totalAmount.toLocaleString('id-ID')}</strong> ke nomor berikut:</p>
            <h2 style={{letterSpacing: '2px', color: '#333'}}>0857-8956-4917</h2>
            <p style={{fontSize: '0.85rem', color: '#666', marginTop: '0.5rem'}}>A.n. Sambal Perisa Nusantara</p>
            <button className="btn" style={{background: '#118ee9', color: '#fff', width: '100%', marginTop: '1rem'}} onClick={() => window.open('https://link.dana.id/minta/', '_blank')}>
              Buka Aplikasi DANA Sekarang
            </button>
          </div>
        )}

        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
          <button className="btn btn-outline" onClick={() => window.location.href = "/"}>Kembali Berbelanja</button>
          <button className="btn btn-primary" onClick={() => navigate('/lacak')}>Pantau Detail Pesanan</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2 style={{marginBottom: '2rem'}}>Checkout Pesanan</h2>
      
      <form onSubmit={handleProcessOrder} className="checkout-grid">
        <div className="checkout-left">
          
          <div className="checkout-section">
            <h3 className="checkout-section-title"><MapPin size={24} /> Informasi Pengiriman</h3>
            
            <div className="form-group">
              <label className="form-label">Nama Penerima</label>
              <input type="text" className="form-input" required placeholder="Masukkan nama lengkap penerima..." 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">No. Telepon / WhatsApp</label>
                <input type="tel" className="form-input" required placeholder="Contoh: 081234567890" 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Kode Pos</label>
                <input type="number" className="form-input" required placeholder="Contoh: 12345"
                  value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Alamat Lengkap</label>
              
              <button type="button" className="location-btn" onClick={handleGetLocation} disabled={isLocating}>
                <MapPin size={18} /> {isLocating ? 'Mencari Lokasi...' : 'Gunakan Lokasi Terkini Anda'}
              </button>
              
              {locationCoords && (
                <div className="map-container" style={{ marginTop: '1rem', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #EEE' }}>
                  <iframe 
                    width="100%" 
                    height="250" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0" 
                    src={`https://maps.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}&z=15&output=embed`}
                  ></iframe>
                </div>
              )}
              {formData.address.includes('Koordinat GPS') && !locationCoords && (
                <div className="map-placeholder">
                  <MapPin size={32} color="var(--primary-red)" />
                  <strong>Lokasi Ditandai</strong>
                  <span>Koordinat sudah tersimpan.</span>
                </div>
              )}

              <textarea 
                className="form-input" 
                rows="4" 
                required 
                placeholder="Nama Jalan, RT/RW, Kecamatan, Kota, dsb."
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>
            
          </div>

          <div className="checkout-section">
            <h3 className="checkout-section-title"><CreditCard size={24} /> Metode Pembayaran</h3>
            <div className="payment-methods">
              <div className={`payment-method ${paymentMethod === 'dana' ? 'active' : ''}`} onClick={() => setPaymentMethod('dana')} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{ background: '#118ee9', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>DANA</div>
                <span style={{fontWeight: 500, fontSize: '0.9rem'}}>Otomatis / App</span>
              </div>
              <div className={`payment-method ${paymentMethod === 'transfer' ? 'active' : ''}`} onClick={() => setPaymentMethod('transfer')}>
                <Banknote size={24} color={paymentMethod === 'transfer' ? 'var(--primary-red)' : '#757575'} />
                <span style={{fontWeight: 500, fontSize: '0.9rem', textAlign: 'center'}}>Transfer Bank</span>
              </div>
              <div className={`payment-method ${paymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setPaymentMethod('cod')}>
                <Truck size={24} color={paymentMethod === 'cod' ? 'var(--primary-red)' : '#757575'} />
                <span style={{fontWeight: 500, fontSize: '0.9rem', textAlign: 'center'}}>COD</span>
              </div>
            </div>
          </div>

        </div>
        
        <div className="checkout-right">
          <div className="checkout-section" style={{position: 'sticky', top: '100px'}}>
            <h3 className="checkout-section-title">Ringkasan Belanja</h3>
            
            <div style={{marginBottom: '1.5rem'}}>
              {cart.map(item => (
                <div key={item.id} style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem', fontSize:'0.9rem'}}>
                  <div>
                    <div style={{fontWeight: 600}}>{item.name}</div>
                    <div style={{color: 'var(--text-light)'}}>Rp {item.price.toLocaleString('id-ID')} x {item.qty}</div>
                  </div>
                  <div style={{fontWeight: 600}}>
                    Rp {(item.price * item.qty).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{borderTop: '1px dashed #EEE', paddingTop: '1.5rem', marginBottom: '1.5rem'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem', color:'var(--text-light)'}}>
                <span>Total Harga Barang</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem', color:'var(--text-light)'}}>
                <span>Ongkos Kirim</span>
                <span>Rp {shipping.toLocaleString('id-ID')}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #EEE', fontWeight:700, fontSize:'1.25rem', color:'var(--primary-orange)'}}>
                <span>Total Tagihan</span>
                <span>Rp {(total + shipping).toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '1rem', fontSize: '1.1rem'}}>
              Proses Pemesanan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
