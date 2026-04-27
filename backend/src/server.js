require('dotenv').config();
const http = require('http');
const app = require('./app'); // ✅ yahi use hoga
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const logger = require('./config/logger');
const { initSocket } = require('./socket');
const path = require("path");
const express = require("express");

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

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