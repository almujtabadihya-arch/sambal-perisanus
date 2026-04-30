const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// -- Robust Database Connection --
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection ERROR:', err));

// -- Models --
const Order = mongoose.model('Order', new mongoose.Schema({
  customer: Object, items: Array, totalAmount: Number, status: String, date: { type: Date, default: Date.now }, history: Array
}));

const Message = mongoose.model('Message', new mongoose.Schema({
  userId: String, text: String, sender: String, timestamp: { type: Date, default: Date.now }
}));

// -- Health Check --
app.get('/api/health', (req, res) => res.json({ status: 'ALIVE', db: mongoose.connection.readyState }));

// -- Order Endpoints --
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order({ ...req.body, status: 'Menunggu Pembayaran', history: [{ status: 'Menunggu Pembayaran', date: new Date(), notes: 'Pesanan diterima.' }] });
    await order.save();
    res.json({ orderId: order._id, ...order._doc });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders', async (req, res) => res.json(await Order.find().sort({ date: -1 })));

app.get('/api/orders/:id', async (req, res) => res.json(await Order.findById(req.params.id)));

app.put('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.status = req.body.status;
    order.history.push({ status: req.body.status, date: new Date(), notes: req.body.notes });
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -- Chat Endpoints (BOSS MODE) --
app.post('/api/messages', async (req, res) => {
  try {
    const msg = new Message(req.body);
    await msg.save();
    res.json(msg);
  } catch (err) { 
    console.error('Chat Error:', err);
    res.status(500).json({ error: 'Gagal simpan pesan' }); 
  }
});

app.get('/api/messages/:userId', async (req, res) => res.json(await Message.find({ userId: req.params.userId }).sort({ timestamp: 1 })));

app.get('/api/messages/admin/list', async (req, res) => {
  const users = await Message.distinct('userId');
  const chatList = {};
  for (const uid of users) {
    chatList[uid] = await Message.find({ userId: uid }).sort({ timestamp: 1 });
  }
  res.json(chatList);
});

app.post('/api/login', (req, res) => {
  if (req.body.username === 'admin' && req.body.password === 'admin123') res.json({ token: 'BOSS_TOKEN' });
  else res.status(401).json({ error: 'Salah password!' });
});

module.exports = app;
