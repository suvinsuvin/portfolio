const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectDB() {
  try {
    if (!db) {
      await client.connect();
      db = client.db();
      console.log('✅ Connected to MongoDB');
    }
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await client.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

module.exports = connectDB;