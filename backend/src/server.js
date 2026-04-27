require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const logger = require('./config/logger');
const { initSocket } = require('./socket');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  await connectRedis();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    logger.info(`🚀 QuickFix server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });

  server.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
};

startServer();