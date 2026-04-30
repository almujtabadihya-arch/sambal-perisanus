import React, { useState, useEffect } from 'react';
import { Package, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const PROGRESS_STEPS = [
    'Menunggu Pembayaran',
    'Sedang Diproses',
    'Sedang Dikemas',
    'Sedang Kurir / Dikirim',
    'Selesai'
  ];

  useEffect(() => {
    const fetchMyOrders = async () => {
      const savedIds = JSON.parse(localStorage.getItem('mySambalOrders') || '[]');
      if (savedIds.length === 0) {
        setLoading(false);
        return;
      }
      
      const fetchedOrders = [];
      for (const id of savedIds) {
        try {
          const res = await fetch(`/api/orders/${id}`);
          if (res.ok) {
            const data = await res.json();
            // Fallback for older orders without history array
            if (!data.history) {
               data.history = [
                 { status: data.status, date: data.date, notes: data.adminNotes || '' }
               ];
            }
            fetchedOrders.push(data);
          }
        } catch (err) {
          console.error(err);
        }
      }
      fetchedOrders.reverse(); // Newest first
      setOrders(fetchedOrders);
      setLoading(false);
    };

    fetchMyOrders();
  }, []);

  const getStepIndex = (status) => {
    return PROGRESS_STEPS.indexOf(status);
  };

  if (loading) {
     return <div className="container flex-center" style={{ minHeight: '60vh' }}><h3>Memuat Riwayat Pesanan...</h3></div>;
  }

  if (orders.length === 0) {
     return (
       <div className="container flex-center" style={{ padding: '3rem 1rem', minHeight: '60vh', flexDirection: 'column' }}>
          <Package size={80} color="#ddd" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text-light)' }}>Anda belum memiliki pesanan.</h2>
          <p style={{ marginBottom: '2rem' }}>Belanja sekarang untuk mencicipi kelezatan Sambal Perisa Nusantara!</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Mulai Belanja</button>
       </div>
     );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem', minHeight: '60vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-red)' }}>Dasbor Pesanan Saya</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem' }}>
        Pantau otomatis seluruh pergerakan fisik barang Anda secara transparan.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {orders.map((orderData) => (
          <div key={orderData.id} style={{ maxWidth: '800px', width: '100%', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EEE', paddingBottom: '1rem', marginBottom: '2rem' }}>
               <h3 style={{ margin: 0 }}>Order ID: {orderData.id}</h3>
               <span style={{ 
                 padding: '0.4rem 1rem', 
                 background: orderData.status === 'Selesai' ? '#d4edda' : '#fff3cd', 
                 color: orderData.status === 'Selesai' ? '#155724' : '#856404', 
                 borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' 
               }}>
                 {orderData.status}
               </span>
            </div>

            {/* Visual Head Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '3rem', marginTop: '1rem' }}>
              <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '4px', background: '#eee', zIndex: 0 }}></div>
              
              {PROGRESS_STEPS.map((step, idx) => {
                const isActive = getStepIndex(orderData.status) >= idx;
                const isCurrent = getStepIndex(orderData.status) === idx;
                return (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%', zIndex: 1, position: 'relative' }}>
                    {isCurrent && orderData.status !== 'Selesai' && (
                       <span style={{ position: 'absolute', top: '-15px', right: '35%', background: 'red', width: '10px', height: '10px', borderRadius: '50%' }}></span>
                    )}
                    <div style={{ 
                      width: '34px', height: '34px', borderRadius: '50%', 
                      background: isActive ? 'var(--primary-red)' : '#eee',
                      color: isActive ? '#fff' : '#999',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', border: '3px solid #fff', boxShadow: '0 0 0 2px ' + (isActive ? 'var(--primary-red)' : '#eee')
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '0.5rem', color: isActive ? '#333' : '#999', fontWeight: isActive ? 600 : 400 }}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Riwayat Vertikal (Vertical Timeline) */}
            <div style={{ background: '#fcfcfc', border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
               <h4 style={{ margin: '0 0 1.5rem 0', color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>Detail Jejak Riwayat</h4>
               
               <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                 {orderData.history.map((hist, idx) => (
                   <div key={idx} style={{ position: 'relative', paddingBottom: '1.5rem' }}>
                     {/* Garis vertikal penghubung */}
                     {idx !== orderData.history.length - 1 && (
                       <div style={{ position: 'absolute', left: '-15px', top: '24px', bottom: 0, width: '2px', background: '#ddd' }}></div>
                     )}
                     
                     {/* Titik indikator waktu */}
                     <div style={{ 
                       position: 'absolute', left: '-20px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', 
                       background: idx === 0 ? 'var(--primary-orange)' : '#ccc',
                       border: '2px solid #fff', boxShadow: '0 0 0 1px ' + (idx === 0 ? 'var(--primary-orange)' : '#ccc')
                     }}></div>
                     
                     <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 600, marginBottom: '0.3rem' }}>
                       {new Date(hist.date).toLocaleString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'})} WIB
                     </div>
                     <div style={{ fontSize: '1rem', fontWeight: idx === 0 ? 'bold' : 'normal', color: idx === 0 ? '#000' : '#444' }}>
                       Status: {hist.status}
                       {idx === 0 && <span style={{ marginLeft: '10px', fontSize: '0.75rem', background: '#ff5722', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>NEW</span>}
                     </div>
                     {hist.notes && (
                       <div style={{ marginTop: '0.6rem', padding: '0.85rem', background: '#e3f2fd', borderLeft: '4px solid #2196f3', borderRadius: '6px', fontSize: '0.9rem', color: '#0d47a1', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                           <Package size={14} color="#2196f3" /> Update Logistik / Dapur
                         </div>
                         <div style={{ lineHeight: '1.4' }}>{hist.notes}</div>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            </div>

            {/* Existing Info: Tujuan & Pesanan */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
              <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid #DDD', paddingBottom: '0.5rem' }}>Alamat Tujuan</h4>
                <p style={{margin: '0 0 0.5rem 0'}}><strong>{orderData.customer.name}</strong></p>
                <p style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem'}}>{orderData.customer.phone}</p>
                <p style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem'}}>{orderData.customer.address}</p>
                <p style={{margin: '0', fontSize: '0.9rem'}}><strong>Kode Pos:</strong> {orderData.customer.postalCode || '-'}</p>
              </div>
              
              <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid #DDD', paddingBottom: '0.5rem' }}>Detail Belanjaan</h4>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0', fontSize: '0.9rem' }}>
                  {orderData.items.map(item => (
                    <li key={item.id}>{item.name} x{item.qty}</li>
                  ))}
                </ul>
                <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}><strong>Total: Rp {orderData.totalAmount.toLocaleString('id-ID')}</strong></p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
