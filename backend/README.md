# Rocket Cars Admin - Backend API
## Инструкция к запуску тестового сервера 

## 📦 Зависимости

Убедитесь, что у вас установлен Python 3.8+.

## ⚙️ Установка

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/gulykka/rocketCarsAdmin.git
   cd rocketCarsAdmin/backend
   ```

2. Создайте и активируйте виртуальное окружение:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Linux/macOS
   .\.venv\Scripts\activate   # Windows
   ```

3. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

## 🚀 Запуск сервера

### Стандартный запуск (порт 8000)
```bash
uvicorn imitation:app --reload
```

### Запуск на определенном порту
```bash
uvicorn imitation:app --port 5000 --reload
```

### Запуск с хостом 0.0.0.0 (для доступа из сети)
```bash
uvicorn imitation:app --host 0.0.0.0 --port 8000 --reload
```

## 📚 API Endpoints

### Авторизация
- `POST /api/login` - вход в систему
  ```json
  {
    "login": "string",
    "password": "string"
  }
  ```

### Смена пароля
- `POST /api/change-pass/` - изменение пароля
  ```json
  {
    "old": "string",
    "new": "string",
    "repeat": "string"
  }
  ```

## 🔍 Документация API

После запуска сервера документация доступна по адресам:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI Schema: http://localhost:8000/openapi.json

## 🛠️ Структура проекта

```
backend/
├── data/
│   └── test_data.json       # Тестовые данные автомобилей
├── imitation.py                 # Основной файл приложения
├── validation.py           # Pydantic модели
├── logic.py                # Бизнес-логика
├── requirements.txt        # Зависимости
└── README.md              # Этот файл
```

## ⚠️ Тестовые данные

Сервер использует тестовые данные из `data/test_data.json`. Формат данных:
```json
[
  {
    "name": "Название авто",
    "VIN": "VIN1234567890",
    "auto": "Модель",
    "year": "2023",
    "status_complete": false
  }
]
```