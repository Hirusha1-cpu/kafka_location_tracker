// location-producer/producer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'location-producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

// Simulate vehicle movement
async function simulateVehicleMovement() {
  await producer.connect();
  
  // Starting position (example: New York City)
  let latitude = 6.927079;
  let longitude = 79.861244;

  setInterval(async () => {
    // Simulate movement by slightly changing coordinates
    latitude += (Math.random() - 0.5) * 0.001;
    longitude += (Math.random() - 0.5) * 0.001;

    const locationData = {
      vehicleId: 'vehicle-1',
      latitude,
      longitude,
      timestamp: new Date()
    };

    await producer.send({
      topic: 'vehicle-locations',
      messages: [
        { value: JSON.stringify(locationData) }
      ],
    });

    console.log('Location update sent:', locationData);
  }, 10000); // Send update every 10 seconds
}

simulateVehicleMovement().catch(console.error);