import express from 'express';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// MongoDB connection
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'moscow_tourism';
let client;

// Middleware для CORS (если фронтенд на другом порту/домене)
app.use(cors());

// Функция подключения к MongoDB
async function connectToMongo() {
  try {
    client = new MongoClient(mongoUrl);
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Обслуживание статических файлов
app.use(express.static(join(__dirname, 'public')));

// API endpoint для получения данных
app.get('/api/data', async (req, res) => {
  try {
    if (!client) {
      return res.status(500).json({ error: 'Database not initialized' });
    }

    const db = client.db(dbName);
    const collection = db.collection('data');

    // Проверяем, существует ли коллекция
    const data = await collection.findOne({});
    if (!data) {
      return res.status(404).json({ error: 'Data not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Старт сервера
async function startServer() {
  try {
    await connectToMongo();

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

// Обработка завершения работы сервера
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  if (client) {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
  process.exit(0);
});

startServer();
