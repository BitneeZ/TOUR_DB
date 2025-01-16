import pandas as pd

# Создание DataFrame из предоставленных данных
data = """
Название,Рейтинг,Координаты
Александровский сад,4.9,55.752075 37.613610
Красная площадь,4.8,55.753544 37.621202
Москва-Сити,4.8,55.747071 37.539256
Останкинская телебашня,4.8,55.819721 37.611704
Старый Арбат,4.4,55.748534 37.588431
Третьяковская галерея,4.9,55.741556 37.620028
Московский Кремль,4.8,55.751426 37.618879
Храм Василия Блаженного,4.8,55.752507 37.623150
«Москвариум»,4.8,55.832985 37.618413
Патриаршие пруды,4.7,55.764244 37.592722
ВДНХ,4.7,55.826249 37.637577
Государственный исторический музей,4.9,55.755294 37.617796
ГУМ,4.8,55.754572 37.621182
Большой театр,4.9,55.760257 37.618536
Нескучный сад,4.9,55.717246 37.587344
Парк «Зарядье»,4.5,55.751188 37.627940
Храм Христа Спасителя,4.8,55.744661 37.605526
Чистые пруды,4.8,55.761195 37.645196
Сталинские высотки,4.9,55.747083 37.642787
Бульварное кольцо,4.7,55.761018 37.601528
Воробьёвы горы,4.8,55.709382 37.542250
Парк Горького,4.8,55.729221 37.600892
Музей космонавтики,4.9,55.822710 37.639743
Ивановская горка,4.7,55.755105 37.641845
Фабрика «Красный октябрь»,4.8,55.740726 37.608965
Дарвиновский музей,4.8,55.690797 37.561547
Кремль в Измайлово,4.5,55.794746 37.749450
Новодевичий монастырь,4.8,55.726353 37.556200
Москва-река,4.7,55.738576 37.568126
Пятницкая улица,4.7,55.737846 37.628137
Могила Неизвестного Солдата,4.9,55.754783 37.616152
Собор Непорочного Зачатия Пресвятой Девы Марии,4.9,55.767172 37.571155
Спасская башня,4.9,55.752563 37.621441
Московский зоопарк,4.5,55.761092 37.578308
Московское метро,4.7,55.769090 37.596457
Музей-заповедник «Царицыно»,4.8,55.616409 37.683215
Парк «Сокольники»,4.8,55.804522 37.670672
Мавзолей Ленина,4.6,55.753673 37.619881
Коломенское,4.9,55.667650 37.670862
Никольская улица,4.7,55.757192 37.622522
Тверская улица,4.4,55.763596 37.606953
Алмазный фонд,4.9,55.749593 37.613807
Царь-колокол,4.7,55.750784 37.618495
Оружейная палата,4.8,55.749455 37.613473
Центральный детский мир,4.9,55.760268 37.624895
Стадион «Лужники»,4.8,55.715742 37.553728
Новодевичье кладбище,4.5,55.724359 37.554272
Главный Ботанический сад РАН,4.7,55.840852 37.605444
Лосиный остров,4.6,55.862094 37.825681
Царь-пушка,4.5,55.751435 37.617918
Российская государственная библиотека,4.9,55.751312 37.609371
Дом Пашкова,4.9,55.749778 37.608419
Триумфальные ворота,4.9,55.736786 37.519997
Здание МГУ,4.9,55.703087 37.530862
Крутицкое подворье,4.9,55.728130 37.658436
Парк искусств «Музеон»,4.8,55.736468 37.609086
Манежная площадь,4.7,55.755667 37.615062
Улица Мясницкая,4.7,55.764668 37.636814
Большой Московский цирк,4.9,55.694511 37.540210
Филёвский парк,4.7,55.748124 37.483912
Государственный музей изобразительных искусств имени А. С. Пушкина,4.9,55.747224 37.605240
Колокольня Ивана Великого,4.7,55.750730 37.618231
Донской монастырь,4.9,55.714425 37.602061
«Рабочий и колхозница»,4.8,55.828165 37.646810
Парк Победы на Поклонной горе,4.9,55.731735 37.507290
Цирк Никулина на Цветном бульваре,4.9,55.770580 37.619880
Успенский собор,4.7,55.750935 37.617013
Грановитая палата,4.6,55.750514 37.616785
Парк «Серебряный бор»,4.8,55.781771 37.425662
Бункер-42,4.7,55.741754 37.649256
Архангельский собор,4.8,55.750179 37.617675
Усадьба Кусково,4.8,55.736941 37.809130
Ботанический сад МГУ «Аптекарский огород»,4.8,55.778436 37.635467
Коломенский дворец,4.8,55.655900 37.656582
Воронцовский парк,4.8,55.666613 37.531447
Измайловский парк культуры и отдыха,4.8,55.777764 37.793825
Мосфильм,4.8,55.722912 37.531833
Государственный музей А. С. Пушкина,4.8,55.743758 37.597320
Покровский ставропигиальный женский монастырь,4.9,55.737922 37.669816
Парк птиц «Воробьи»,4.9,55.158957 36.778894
Московский планетарий,4.8,55.761392 37.583571
Музей-усадьба «Архангельское»,4.8,55.784558 37.284041
Благовещенский собор Кремля,4.8,55.749958 37.616973
Новая Третьяковка,4.8,55.734719 37.605976
Соборная мечеть,4.9,55.779011 37.626932
Центральный выставочный зал «Манеж»,4.8,55.753568 37.612368
Московский театр оперетты,4.9,55.760175 37.616182
Музей-заповедник «Абрамцево»,4.9,56.234256 37.968090
Парк Покровское-Стрешнево,4.9,55.822112 37.476378
Театр «Современник»,4.8,55.761747 37.645869
Новоспасский ставропигиальный мужской монастырь,4.9,55.731905 37.656670
Парк-усадьба Кузьминки,4.8,55.684097 37.803310
Екатерининский парк,4.8,55.783193 37.620024
Сад «Эрмитаж»,4.7,55.770688 37.609090
Дом музыки,4.9,55.733364 37.646528
Бородинская панорама,4.8,55.738752 37.523187
Музей русского импрессионизма,4.8,55.780328 37.570409
Усадьба Свиблово,4.9,55.853432 37.631666
Богоявленский Собор в Елохове,4.9,55.772577 37.674674
Московский музей современного искусства,4.4,55.767011 37.614226
"""

# Чтение данных из строки в DataFrame
from io import StringIO

df = pd.read_csv(StringIO(data))

# Добавление категорий достопримечательностей (вручную или по логике)
categories = [
    "Природные", "Исторические", "Современные", "Современные", "Культурные", "Культурные",
    "Исторические", "Исторические", "Современные", "Природные", "Культурные", "Исторические",
    "Современные", "Культурные", "Природные", "Культурные", "Исторические", "Исторические",
    "Исторические", "Современные", "Природные", "Культурные", "Исторические", "Современные",
    "Природные", "Исторические", "Исторические", "Природные", "Исторические", "Исторические",
    "Исторические", "Природные", "Культурные", "Современные", "Исторические", "Культурные",
    "Культурные", "Исторические", "Исторические", "Современные", "Культурные", "Культурные",
    "Современные", "Исторические", "Культурные", "Исторические", "Исторические", "Культурные",
    "Природные", "Исторические", "Природные", "Современные", "Культурные", "Природные",
    "Культурные", "Современные", "Исторические", "Современные", "Культурные", "Исторические",
    "Исторические", "Современные", "Исторические", "Исторические", "Исторические", "Культурные",
    "Исторические", "Культурные", "Современные", "Культурные", "Природные", "Культурные",
    "Современные", "Исторические", "Культурные", "Природные", "Исторические", "Культурные",
    "Культурные", "Исторические", "Культурные", "Природные", "Культурные", "Культурные",
    "Современные", "Природные", "Исторические", "Природные", "Исторические", "Культурные",
]

df['Категория'] = categories

