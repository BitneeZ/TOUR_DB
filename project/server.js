const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

const app = express();
const port = 3000;

// Настройка CORS
app.use(cors());

// Подключаемся к базе данных MongoDB
mongoose.connect('mongodb://localhost:27017/moscow_tourism', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Подключение к MongoDB успешно!"))
  .catch(err => console.error("Ошибка подключения к MongoDB:", err));

// Схемы для данных
const TouristPlaceSchema = new mongoose.Schema({
  Name: String,
  Rate: Number,
  "Price(rub)": Number
});

const RestaurantSchema = new mongoose.Schema({
  Name: String,
  Kitchen: String,
  Time: String,
  Rate: String,
  Price: String
});

const HotelSchema = new mongoose.Schema({
  Name: String,
  Rate: Number,
  active_price: String,
  address: String
});

const MoscowTourismSchema = new mongoose.Schema({
  tourist_places: [TouristPlaceSchema],
  restaurants: [RestaurantSchema],
  hotels: [HotelSchema]
});

// Привязываем модель к существующей коллекции 'data'
const TourismData = mongoose.model('TourismData', MoscowTourismSchema, 'data');

// Роут для получения данных
app.get('/data', async (req, res) => {
  try {
    const data = await TourismData.findOne(); // Извлекаем данные из коллекции 'data'
    res.json(data);
  } catch (err) {
    console.error("Ошибка при извлечении данных:", err);
    res.status(500).json({ error: 'Ошибка при извлечении данных' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});