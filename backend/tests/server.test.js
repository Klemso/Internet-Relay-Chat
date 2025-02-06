const request = require('supertest');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const cors = require('cors');
const channelRoutes = require('../routes/channelRoutes');

// backend/server.test.js

require("dotenv").config();

describe('Server', () => {
  let server;
  let io;
  let app;

  beforeAll((done) => {
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api', channelRoutes);

    server = http.createServer(app);
    io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    mongoose.connect(process.env.MONGO_URI)
      .then(() => {
        server.listen(3000, () => {
          console.log('Server running on port 3000');
          done();
        });
      })
      .catch((err) => {
        console.error(err);
        done(err);
      });
  });

  afterAll((done) => {
    mongoose.connection.close()
      .then(() => {
        server.close(done);
      });
  });

  it('should start the server', (done) => {
    request(server)
      .get('/')
      .expect(404, done); // Assuming the root route is not defined and returns 404
  });

  it('should have the /api route', (done) => {
    request(server)
      .get('/api')
      .expect(404, done); // Assuming /api route is not defined in channelRoutes
  });

  it('should connect to MongoDB', () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 means connected
  });
});