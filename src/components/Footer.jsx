import React from 'react';
import SastramiharjaLogo from '../assets/Sastramiharja.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={SastramiharjaLogo} alt="Sastramiharja Logo" className="footer-logo" />
            <h3>Sambal Perisa Nusantara</h3>
            <p>Sensasi pedas nusantara dengan resep rahasia yang autentik dan bahan berkualitas. Teman makan siang, sore, dan malam Anda!</p>
          </div>
          
          <div className="footer-links">
            <h4>Navigasi</h4>
            <ul>
              <li><a href="/">Beranda</a></li>
              <li><a href="#products-section">Produk Kami</a></li>
              <li><a href="#">Tentang Kami</a></li>
              <li><a href="#">Hubungi Penjual</a></li>
            </ul>
          </div>
          
          <div className="footer-social">
            <h4>Ikuti Kami</h4>
            <div className="social-icons">
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
              <a href="#">TikTok</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sambal Perisa Nusantara. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
