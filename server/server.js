require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const seedSkills = require('./utils/seedSkills');
const seedItems = require('./utils/seedItems');
const { initChatSocket } = require('./socket/chatSocket');
const User = require('./models/User');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas, then start the HTTP server
connectDB().then(async () => {
  // Seed default campus skills if collection is empty
  await seedSkills();

  // Seed default rental items if collection is empty
  const firstUser = await User.findOne();
  if (firstUser) {
    await seedItems(firstUser._id);
  }

  const server = http.createServer(app);

  // Initialize Socket.io
  const io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // Attach io to Express app so controllers can access if needed
  app.set('io', io);

  // Initialize Chat Socket listeners
  initChatSocket(io);

  server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║       CampusSwap API Server v1.0          ║
╠═══════════════════════════════════════════╣
║  Status  : Running                        ║
║  Port    : ${PORT}                               ║
║  Mode    : ${process.env.NODE_ENV || 'development'}               ║
║  Health  : http://localhost:${PORT}/api/health  ║
╚═══════════════════════════════════════════╝
    `);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  });

  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION:', err.message);
    server.close(() => process.exit(1));
  });
});
