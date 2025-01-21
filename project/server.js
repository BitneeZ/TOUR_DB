const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Подключаем path для работы с путями

// Создаем сервер
const app = express();
const port = 3000;

// Настройка CORS (чтобы ваш фронтенд мог делать запросы к серверу)
app.use(cors());

// Подключаемся к базе данных MongoDB
mongoose.connect('mongodb://localhost:27017/moscow_tourism', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Подключение к MongoDB успешно!");
}).catch(err => {
  console.error("Ошибка подключения к MongoDB:", err);
});

// Указываем папку со статическими файлами (где лежит index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Создаем модель для данных
const TourismData = mongoose.model('TourismData', new mongoose.Schema({
  category: String,
  name: String,
  rate: Number,
  price: Number,
  kitchen: String,
  active_price: Number
}));

// Роут для получения данных
app.get('/data', async (req, res) => {
  try {
    const data = await TourismData.find(); // Извлекаем все данные
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при извлечении данных' });
  }
});

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});