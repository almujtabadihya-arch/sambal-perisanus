import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId] = useState(() => {
    let uid = localStorage.getItem('chatUserId');
    if (!uid) {
      uid = 'USER-' + Math.floor(Math.random() * 1000000);
      localStorage.setItem('chatUserId', uid);
    }
    return uid;
  });

  const messagesEndRef = useRef(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  // -- Polling Messages (Level Dewa) --
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${userId}`);
        const data = await res.json();
        
        if (data.length > messages.length) {
          if (!isOpenRef.current) {
            setUnreadCount(prev => prev + (data.length - messages.length));
          }
          setMessages(data);
        }
      } catch (err) {
        console.error('Chat error:', err);
      }
    };

    fetchMessages(); // Initial fetch
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [userId, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      userId,
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      setInput('');
      // Immediately fetch after sending
      const res = await fetch(`/api/messages/${userId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      alert('Gagal mengirim pesan.');
    }
  };

  return (
    <div className="chat-widget">
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <MessageCircle size={24} />
          <div style={{flex: 1}}>
            <h4 style={{margin: 0, fontSize: '1.1rem'}}>Admin Sambal</h4>
            <span style={{fontSize: '0.8rem', opacity: 0.8}}>Online</span>
          </div>
          <button style={{background:'none', border:'none', color:'white', cursor:'pointer'}} onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="chat-body">
          <div style={{display: 'flex', flexDirection: 'column'}}>
            {messages.length === 0 && (
              <div style={{textAlign: 'center', color: '#888', marginTop: '2rem', fontSize: '0.8rem'}}>
                Halo! Ada yang bisa kami bantu?
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender === 'admin' ? 'msg-seller' : 'msg-user'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Ketik pesan..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>

      {!isOpen && (
        <button className="chat-btn" onClick={() => setIsOpen(true)} style={{ position: 'relative' }}>
          <MessageCircle size={30} />
          {unreadCount > 0 && (
            <span className="cart-badge" style={{ top: '-10px', right: '-10px' }}>
              {unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
