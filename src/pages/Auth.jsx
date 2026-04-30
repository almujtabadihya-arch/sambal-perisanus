import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // LOGIN
        const res = await fetch('/api/userlogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Gagal login!');
          return;
        }
        login(data.user); 
      } else {
        // REGISTER
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Gagal mendaftar!');
          return;
        }
        login(data.user);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi ke server.');
      console.error(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isLogin ? 'Masuk ke Akun' : 'Daftar Akun Baru'}</h2>
        
        <form onSubmit={handleSubmit} style={{textAlign: 'left'}}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Masukkan nama Anda"
                value={name}
                onChange={e => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="Masukkan alamat email Anda"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Kata Sandi</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem', padding: '1rem'}}>
            {isLogin ? 'MASUK' : 'DAFTAR'}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}>
            {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
          </a>
        </p>
      </div>
    </div>
  );
}
