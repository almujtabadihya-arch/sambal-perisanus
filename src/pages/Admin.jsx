import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Package, MessageCircle, Send, CheckCircle, Clock, Truck, ShoppingBag } from 'lucide-react';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  
  // -- Chat States --
  const [allChats, setAllChats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatInput, setChatInput] = useState('');

  const chatEndRef = useRef(null);

  // -- Initialization & Polling --
  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchChats();
      
      const orderInterval = setInterval(fetchOrders, 10000); // Poll orders every 10s
      const chatInterval = setInterval(fetchChats, 3000);   // Poll chats every 3s
      
      return () => {
        clearInterval(orderInterval);
        clearInterval(chatInterval);
      };
    }
  }, [token]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allChats, selectedUser]);


  // -- API Calls --
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/messages/admin/list');
      const data = await res.json();
      setAllChats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const notes = prompt("Tambahkan catatan update logistik (opsional):", "Pesanan sedang diproses.");
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: notes || 'Status diperbarui oleh Admin.' })
      });
      fetchOrders(); 
    } catch (err) {
      alert('Gagal mengubah status');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
      } else alert(data.error);
    } catch (err) {
      alert('Gagal terhubung ke Server.');
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedUser) return;

    const newMessage = {
      userId: selectedUser,
      text: chatInput.trim(),
      sender: 'admin',
      timestamp: new Date()
    };

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      setChatInput('');
      fetchChats();
    } catch (err) {
      alert('Gagal membalas pesan.');
    }
  };

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '2rem' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
             <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)' }}>Admin Central</h2>
             <p style={{ color: '#888' }}>Masuk untuk mengelola pesanan & chat.</p>
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-input" required value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>MASUK SEKARANG</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', minHeight: '100vh', background: '#f9f9f9', gap: '2rem', padding: '2rem' }}>
      
      {/* 1. Manajemen Pesanan */}
      <div style={{ background: '#fff', borderRadius: '32px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: '900', fontSize: '1.8rem' }}>Manajemen Pesanan</h2>
          <button onClick={() => { setToken(null); localStorage.removeItem('adminToken'); }} className="btn btn-outline" style={{ padding: '0.6rem 1.2rem' }}>
            <LogOut size={18} /> Keluar
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EEE' }}>
                <th style={{ padding: '1rem' }}>Pelanggan</th>
                <th style={{ padding: '1rem' }}>Produk</th>
                <th style={{ padding: '1rem' }}>Total</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                   <td style={{ padding: '1.2rem 1rem' }}>
                     <div style={{ fontWeight: '700' }}>{o.customer.name}</div>
                     <div style={{ fontSize: '0.8rem', color: '#888' }}>{o.id.substring(0,8)}...</div>
                   </td>
                   <td style={{ padding: '1rem' }}>
                     {o.items.map(item => <div key={item.id} style={{fontSize:'0.85rem'}}>{item.name} x{item.qty}</div>)}
                   </td>
                   <td style={{ padding: '1rem', fontWeight: '800', color: 'var(--primary)' }}>
                     Rp {o.totalAmount.toLocaleString('id-ID')}
                   </td>
                   <td style={{ padding: '1rem' }}>
                     <span style={{ 
                        padding: '0.3rem 0.8rem', 
                        borderRadius: '99px', 
                        background: 'rgba(255, 152, 0, 0.1)', 
                        color: '#FF9800', 
                        fontSize: '0.75rem', 
                        fontWeight: '800' 
                      }}>
                       {o.status}
                     </span>
                   </td>
                   <td style={{ padding: '1rem' }}>
                      <select 
                        style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid #DDD', fontSize: '0.8rem' }}
                        value={o.status} 
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                      >
                        <option value="Menunggu Pembayaran">Menunggu</option>
                        <option value="Sedang Diproses">Diproses</option>
                        <option value="Sedang Dikemas">Dikemas</option>
                        <option value="Sedang Kurir / Dikirim">Dikirim</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Live Chat Panel */}
      <div style={{ background: '#fff', borderRadius: '32px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontWeight: '900', fontSize: '1.8rem', marginBottom: '1.5rem' }}>Live Chat</h2>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {Object.keys(allChats).map(uid => (
             <button 
                key={uid} 
                onClick={() => setSelectedUser(uid)}
                style={{
                  padding: '0.6rem 1rem',
                  background: selectedUser === uid ? 'var(--primary)' : '#F5F5F5',
                  color: selectedUser === uid ? '#fff' : '#666',
                  border: 'none', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: '700', fontSize: '0.85rem'
                }}
             >
               {uid.substring(0, 8)}...
             </button>
          ))}
        </div>

        <div style={{ flex: 1, background: '#F9F9F9', borderRadius: '24px', padding: '1.5rem', overflowY: 'auto', marginBottom: '1.5rem' }}>
          {!selectedUser ? (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '40%' }}>
              <MessageCircle size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Pilih chat untuk membalas.</p>
            </div>
          ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {allChats[selectedUser]?.map((msg, i) => (
                  <div key={i} style={{ 
                    alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'admin' ? 'var(--text)' : '#FFF',
                    color: msg.sender === 'admin' ? '#FFF' : 'var(--text)',
                    padding: '0.8rem 1.2rem', borderRadius: '20px', maxWidth: '85%',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.02)', fontSize: '0.95rem'
                  }}>
                    {msg.text}
                  </div>
               ))}
               <div ref={chatEndRef} />
             </div>
          )}
        </div>

        <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Balas pesan..." 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={!selectedUser}
            className="form-input"
          />
          <button type="submit" className="btn btn-primary" disabled={!selectedUser || !chatInput.trim()} style={{ padding: '0 1.5rem' }}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
