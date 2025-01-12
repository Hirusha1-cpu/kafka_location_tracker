const express = require('express');
const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Update CORS configuration to match your frontend port
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allow both ports
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Enable CORS for Express routes
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/location_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Location Schema
const LocationSchema = new mongoose.Schema({
  vehicleId: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
});

const Location = mongoose.model('Location', LocationSchema);

// Kafka Configuration
const kafka = new Kafka({
  clientId: 'location-tracker',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'location-group' });

// Kafka Consumer
async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'vehicle-locations', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const locationData = JSON.parse(message.value.toString());
      
      // Save to MongoDB
      const location = new Location(locationData);
      await location.save();

      // Emit to connected clients
      io.emit('locationUpdate', locationData);
    },
  });
}

// Start server
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  runConsumer().catch(console.error);
});