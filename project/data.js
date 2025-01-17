const mockData = {
  tourist_places: {
    places: [
      { name: "Красная площадь", rate: 4.8, price: 0 },
      { name: "Третьяковская галерея", rate: 4.7, price: 800 },
      { name: "Парк Горького", rate: 4.6, price: 0 },
      { name: "ВДНХ", rate: 4.5, price: 0 },
      { name: "Москвариум", rate: 4.4, price: 1200 },
      { name: "Музей космонавтики", rate: 4.6, price: 600 },
      { name: "Царицыно", rate: 4.5, price: 400 },
      { name: "Коломенское", rate: 4.7, price: 0 }
    ],
    stats: {
      avgVisitors: 2575,
      avgRating: 4.4,
      totalPlaces: 25
    }
  },
  restaurants: {
    places: [
      { name: "Пушкинъ", rate: 4.8, kitchen: "Русская" },
      { name: "White Rabbit", rate: 4.7, kitchen: "Современная" },
      { name: "Сахалин", rate: 4.6, kitchen: "Морская" },
      { name: "Северяне", rate: 4.5, kitchen: "Скандинавская" },
      { name: "Горыныч", rate: 4.4, kitchen: "Русская" },
      { name: "Twins Garden", rate: 4.9, kitchen: "Современная" },
      { name: "Чайхона №1", rate: 4.3, kitchen: "Восточная" },
      { name: "Рыбы нет", rate: 4.5, kitchen: "Морская" }
    ],
    kitchenStats: {
      "Русская": 25,
      "Современная": 18,
      "Морская": 15,
      "Восточная": 22,
      "Скандинавская": 8
    },
    stats: {
      avgVisitors: 1650,
      avgRating: 4.3,
      totalPlaces: 42
    }
  },
  hotels: {
    places: [
      { name: "Метрополь", rate: 4.8, metro: "Площадь Революции" },
      { name: "Ritz-Carlton", rate: 4.9, metro: "Охотный Ряд" },
      { name: "Hilton", rate: 4.7, metro: "Киевская" },
      { name: "Azimut", rate: 4.5, metro: "Смоленская" },
      { name: "Radisson", rate: 4.6, metro: "Киевская" },
      { name: "Novotel", rate: 4.4, metro: "Киевская" },
      { name: "Renaissance", rate: 4.5, metro: "Охотный Ряд" },
      { name: "Пекин", rate: 4.3, metro: "Маяковская" }
    ],
    metroStats: {
      "Площадь Революции": 3,
      "Охотный Ряд": 4,
      "Киевская": 6,
      "Смоленская": 2,
      "Маяковская": 3
    },
    stats: {
      avgVisitors: 1450,
      avgRating: 4.5,
      totalPlaces: 38
    }
  }
};