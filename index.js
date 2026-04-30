const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

// -- Database Logic --
let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    if (!mongoURI) throw new Error('MONGO_URI is missing');
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log('✅ DB Connected');
  } catch (err) {
    console.error('❌ DB Error:', err.message);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// -- Models --
const Message = mongoose.model('Message', new mongoose.Schema({
  userId: String, text: String, sender: String, timestamp: { type: Date, default: Date.now }
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  customer: Object, items: Array, totalAmount: Number, status: String, date: { type: Date, default: Date.now }, 
  history: { type: Array, default: [] }
}));

// -- Endpoints --
app.get('/api/health', (req, res) => res.json({ status: 'OK', db: isConnected }));

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order({ 
      ...req.body, 
      status: 'Menunggu Pembayaran', 
      history: [{ status: 'Menunggu Pembayaran', date: new Date(), notes: 'Pesanan telah diterima oleh dapur Sambal Perisa.' }] 
    });
    await order.save();
    res.json({ orderId: order._id, id: order._id, ...order._doc });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders.map(o => ({ id: o._id, ...o._doc })));
  } catch (err) { res.json([]); }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not Found' });
    res.json({ id: order._id, ...order._doc });
  } catch (err) { res.status(404).json({ error: 'Order Not Found' }); }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not Found' });
    order.status = req.body.status;
    order.history.push({ status: req.body.status, date: new Date(), notes: req.body.notes || 'Status diperbarui oleh Admin.' });
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/messages', async (req, res) => {
  try {
    const msg = new Message(req.body);
    await msg.save();
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/messages/:userId', async (req, res) => {
  try {
    res.json(await Message.find({ userId: req.params.userId }).sort({ timestamp: 1 }));
  } catch (err) { res.json([]); }
});

app.get('/api/messages/admin/list', async (req, res) => {
  try {
    const users = await Message.distinct('userId');
    const result = {};
    for (const u of users) result[u] = await Message.find({ userId: u }).sort({ timestamp: 1 });
    res.json(result);
  } catch (err) { res.json({}); }
});

app.post('/api/login', (req, res) => {
  if (req.body.username === 'admin' && req.body.password === 'admin123') res.json({ token: 'BOSS_TOKEN' });
  else res.status(401).json({ error: 'Login Gagal!' });
});

app.post('/api/userlogin', (req, res) => {
  res.json({ user: { name: req.body.email.split('@')[0], email: req.body.email } });
});

app.post('/api/register', (req, res) => {
  res.json({ user: { name: req.body.name, email: req.body.email } });
});

module.exports = app;
