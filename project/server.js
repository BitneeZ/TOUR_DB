const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Создаем сервер
const app = express();
const port = 3000;

// Настройка CORS (чтобы фронтенд мог взаимодействовать с сервером)
app.use(cors());

// Подключаемся к базе данных MongoDB
mongoose.connect('mongodb://localhost:27017/moscow_tourism', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Подключение к MongoDB успешно!");
}).catch(err => {
  console.error("Ошибка подключения к MongoDB:", err);
});

// Модель для хранения всех категорий
const TourismData = mongoose.model('TourismData', new mongoose.Schema({}, { strict: false }));

// Роут для получения данных по категории
app.get('/data/:category', async (req, res) => {
  const { category } = req.params;

  try {
    // Извлекаем данные, которые соответствуют указанной категории
    const data = await TourismData.find({ category }).exec();
    res.json(data);
  } catch (err) {
    console.error("Ошибка при извлечении данных:", err);
    res.status(500).json({ error: 'Ошибка при извлечении данных' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
