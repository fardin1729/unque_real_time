require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', (socket) => {
  console.log('New client connected with id:', socket.id);

  socket.emit('connection_ack', {
    status: 'connected',
    socketId: socket.id,
    time: new Date().toISOString(),
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const webhookRoutes = require('./routes/webhook')(io);
const apiRoutes = require('./routes/api')(io);

app.use('/webhook', webhookRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Meta Leads Backend is running successfully',
    port: process.env.PORT || 5000,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Webhook URL is http://localhost:${PORT}/webhook`);
});
