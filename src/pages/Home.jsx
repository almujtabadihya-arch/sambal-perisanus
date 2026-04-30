import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, Info, X, Star, ShieldCheck, Flame, CheckCircle, Zap, Heart, ArrowRight, Utensils } from 'lucide-react';
import { AppContext } from '../App';
import cumiUmamiImg from '../assets/cumi_umami.png';
import tongkolNgokolImg from '../assets/tongkol_ngokol.png';
import ayamSuwirImg from '../assets/ayam_suwir.png';
import brandLogoImg from '../assets/Sastramiharja.png';

const productsData = [
  {
    id: 1,
    name: 'Sambal Ayam Suwir',
    theme: 'theme-ayam',
    price: 25000,
    volume: '150ml',
    image: ayamSuwirImg,
    pairing: 'Nasi Liwet & Tahu Tempe',
    description: 'Suwiran ayam melimpah dengan bumbu meresap sampai ke serat terdalam.',
    ingredients: 'Cabai Merah, Ayam Suwir, Bawang Merah, Bawang Putih, Gula Merah, Garam',
    storage: 'Tahan 1 bulan suhu ruang (segel). 1 minggu di kulkas (buka).'
  },
  {
    id: 2,
    name: 'Sambal Tongkol Ngokol',
    theme: 'theme-tongkol',
    price: 25000,
    volume: '150ml',
    image: tongkolNgokolImg,
    pairing: 'Nasi Hangat & Telur Dadar',
    description: 'Ikan tongkol segar yang "ngokol" alias berlimpah di setiap suapan.',
    ingredients: 'Ikan Tongkol Segar, Cabai Merah, Bawang, Minyak Kelapa, Bumbu Rahasia',
    storage: 'Tahan 1 bulan suhu ruang (segel). 5 hari di kulkas (buka).'
  },
  {
    id: 3,
    name: 'Sambal Cumi Umami',
    theme: 'theme-cumi',
    price: 25000,
    volume: '150ml',
    image: cumiUmamiImg,
    pairing: 'Nasi Kuning & Kerupuk Kaleng',
    description: 'Sensasi umami cumi yang kenyal dipadu pedas nampol yang bikin merem melek.',
    ingredients: 'Cumi Asin Pilihan, Cabai Rawit, Bawang Merah, Bawang Putih, Daun Jeruk',
    storage: 'Wajib masuk kulkas setelah dibuka dan disarankan habis dalam 7 hari.'
  }
];

export default function Home() {
  const { addToCart } = useContext(AppContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activePairing, setActivePairing] = useState(productsData[0]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const changeTheme = (themeClass) => {
    document.body.className = themeClass || '';
  };

  return (
    <div className="container">
      <section className="hero-section section-reveal active">
        <div className="hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ width: '40px', height: '2px', background: 'var(--primary)' }}></span>
            <span style={{ fontWeight: '800', letterSpacing: '4px', fontSize: '0.75rem', color: 'var(--primary)' }}>PREMIUM CRAFTED</span>
          </div>
          <h1 className="hero-title">Pedas<br/>Autentik<br/><span style={{ color: 'var(--primary)' }}>Nusantara.</span></h1>
          <p className="hero-subtitle">
            Mahakarya bumbu Indonesia yang diracik khusus untuk kamu yang mendambakan kemewahan rasa dalam setiap suapan.
          </p>
          <button className="btn btn-primary btn-magnetic" onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}>
            LIHAT KOLEKSI <ArrowRight size={20} />
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <img src="https://images.unsplash.com/photo-1564149504294-81c62f7cbd04?q=80&w=1000&auto=format&fit=crop" 
               alt="Hero" 
               style={{ width: '100%', borderRadius: '50px', transform: 'rotate(2deg)', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }} />
        </div>
      </section>

      <div className="marquee-container">
        <div className="marquee-content">
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Flame size={20} fill="#FF9800" color="#FF9800"/> <span>SENSASI PEDAS ASLI INDONESIA</span>
            </div>
          ))}
        </div>
      </div>

      <section id="collection" style={{ padding: '6rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }} className="section-reveal">
          <h2 style={{ fontSize: '3.5rem', fontWeight: '900' }}>Varian Pilihan</h2>
          <p style={{ color: 'var(--text-light)' }}>Pilih rasa favoritmu untuk menemani setiap hidangan.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {productsData.map(product => (
            <div key={product.id} 
                 className="product-card-premium section-reveal"
                 onMouseEnter={() => { changeTheme(product.theme); setActivePairing(product); }}
                 onMouseLeave={() => changeTheme('')}>
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <img src={product.image} alt={product.name} onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', padding: '0.4rem 0.8rem', borderRadius: '12px', fontWeight: '800', fontSize: '0.75rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  {product.volume}
                </div>
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: '800' }}>{product.name}</h3>
              <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>{product.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)' }}>Rp {product.price.toLocaleString('id-ID')}</div>
                <button className="btn btn-primary btn-magnetic" style={{ padding: '0.8rem' }} onClick={() => addToCart(product)}>
                  <ShoppingCart size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-reveal" style={{ padding: '6rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '900' }}>Saran Penyajian</h2>
          <p>Makan makin lahap dengan kombinasi yang tepat.</p>
        </div>
        <div className="food-pairing-card">
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', marginBottom: '1rem' }}>
              <Utensils size={20} /> REKOMENDASI KOKI
            </div>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '2rem', lineHeight: '1.2' }}>Makan {activePairing.name} makin pecah pake <span style={{ color: 'var(--primary)' }}>{activePairing.pairing}</span>.</h3>
            <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
              Rasa pedas yang meledak bertemu dengan nasi hangat, menciptakan harmoni rasa yang bikin nambah terus!
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src={activePairing.image} alt="Pairing" style={{ width: '80%', borderRadius: '40px', boxShadow: '20px 20px 0 var(--accent)' }} />
          </div>
        </div>
      </section>

      <section className="section-reveal" style={{ padding: '6rem 0' }}>
        <div className="food-pairing-card" style={{ gridTemplateColumns: '0.8fr 1.2fr', background: 'transparent', boxShadow: 'none' }}>
           <img src={brandLogoImg} alt="Kisah Kami" style={{ width: '100%', borderRadius: '40px' }} />
           <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1.5rem' }}>Kisah Di Balik<br/>Setiap Botol.</h2>
              <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Sambal Perisa Nusantara lahir dari kecintaan kami pada rempah asli Indonesia. Kami percaya bahwa sambal bukan sekadar pelengkap, melainkan nyawa dari setiap hidangan.
              </p>
              <p style={{ color: '#666', lineHeight: '1.8' }}>
                Setiap varian kami diproses secara tradisional dengan standar kebersihan modern. Tanpa bahan pengawet buatan, kami menjaga keaslian rasa dalam setiap jar yang sampai ke tangan Anda.
              </p>
           </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
             <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             <div style={{ padding: '3.5rem' }}>
                <h2 style={{ fontSize: '3rem', lineHeight: '1', marginBottom: '1.5rem' }}>{selectedProduct.name}</h2>
                <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>{selectedProduct.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                  <div>
                    <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.8rem' }}>KOMPOSISI</div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>{selectedProduct.ingredients}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.8rem' }}>PENYIMPANAN</div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>{selectedProduct.storage}</div>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }} onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
                   BELI SEKARANG - Rp {selectedProduct.price.toLocaleString('id-ID')}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
