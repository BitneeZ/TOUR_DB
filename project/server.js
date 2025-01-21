const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Создаём сервер
const app = express();
const port = 3000;

// Настройка CORS (чтобы ваш фронтенд мог делать запросы к серверу)
app.use(cors());

// Подключаемся к базе данных MongoDB
mongoose.connect('mongodb://localhost:27017/moscow_tourism', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Подключение к MongoDB успешно!");
  })
  .catch(err => {
    console.error("Ошибка подключения к MongoDB:", err);
  });

// Схемы для каждой категории
const TouristPlaceSchema = new mongoose.Schema({
  Name: String,
  Rate: Number,
  "Price(rub)": Number // Учитываем возможность `null` для чисел
});

const RestaurantSchema = new mongoose.Schema({
  Name: String,
  Kitchen: String,
  Time: String, // Может быть `null`
  Rate: String, // Используем `String`, так как в JSON значение иногда "Промо"
  Price: String // Диапазон цен в формате строки
});

const HotelSchema = new mongoose.Schema({
  Name: String,
  Rate: Number, // Учитываем возможность `null` для чисел
  active_price: String, // Цены указаны в формате строки с пробелами
  address: String
});

// Основная схема для всех категорий
const MoscowTourismSchema = new mongoose.Schema({
  tourist_places: [TouristPlaceSchema], // Массив объектов
  restaurants: [RestaurantSchema],     // Массив объектов
  hotels: [HotelSchema]                // Массив объектов
});

// Создаём модель
const TourismData = mongoose.model('TourismData', MoscowTourismSchema);

// Роут для получения всех данных
app.get('/data', async (req, res) => {
  try {
    const data = await TourismData.findOne(); // Извлекаем первый документ из коллекции
    res.json(data); // Отправляем данные клиенту
  } catch (err) {
    console.error("Ошибка при извлечении данных:", err);
    res.status(500).json({ error: 'Ошибка при извлечении данных' });
  }
});

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});