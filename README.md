brew services start rabbitmq

brew services list

# Add the RabbitMQ sbin directory to your path first
export PATH=$PATH:/usr/local/sbin

# Then create the user
rabbitmqctl add_user admin admin123
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"

# Start the RabbitMQ service
# Windows: Start from Services
# Mac/Linux:
sudo service rabbitmq-server start

# Start MongoDB
brew services start mongodb-community

# Check status
brew services list

# Stop services
brew services stop rabbitmq
brew services stop mongodb-community

# Restart services
brew services restart rabbitmq
brew services restart mongodb-community

# List all services
brew services list

## Running the Application

1. Start RabbitMQ and MongoDB:
```bash
docker-compose up -d
```

2. Start the backend:
```bash
cd backend
npm install
node app.js
# In a separate terminal
node locationPublisher.js
```

3. Start the frontend:
```bash
cd frontend
npm install
npm start
```

The application will now be running with:
- RabbitMQ Management Console: http://localhost:15672 (admin/admin123)
- Backend: http://localhost:5000
- Frontend: http://localhost:3000


# Check the MongoDB connection:
mongosh
use location_tracker
db.locations.find().sort({timestamp: -1})
