---
title: Midas API & Bot
emoji: 👑
colorFrom: yellow
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# 🏆 Midas — Финансовый бро для подростков

> Телеграм-бот и веб-приложение для учёта расходов и доходов. Без запары! 😎

![Midas Logo](frontend/public/favicon.svg)

## 🚀 Что это?

**Midas** — это свежее приложение для подростков, которым лень вести скучные таблички,
но хочется понимать куда уходят деньги. Записывай траты голосом, смотри красивую статистику,
соревнуйся с друзьями — кто больше зарабатывает, а кто больше тратит! 👑🃏

## ✨ Основные фичи

- 🎤 **Голосовой ввод** — просто скажи "Купил булку за 200р в пятёрочке" и всё разберётся само
- 📊 **Кайфовая статистика** — графики, диаграммы, тренды — всё красиво и понятно
- 👑 **Рейтинг Король/Шут** — кто из друзей больше зарабатывает (Король) и тратит (Шут)
- 🤖 **ИИ-советы** — умный помощник подскажет где утекают деньги
- 💱 **Мультивалюта** — рубли, доллары, евро, гривны, юани + крипта (BTC, ETH, TON...)
- 🔒 **Код-пароль** — никто чужой не залезет в твои финансы
- 👫 **Друзья и группы** — создавай тусовки и смотри кто на коне

## 🛠️ Стек технологий

| Компонент | Технология |
|---|---|
| Backend | Python 3.12 + FastAPI |
| Frontend | React 18 + Vite + TypeScript |
| Database | PostgreSQL 16 |
| Bot | python-telegram-bot |
| AI (STT) | Whisper.cpp |
| AI (LLM) | OpenRouter (бесплатные модели) |
| State | Zustand |
| Charts | Recharts |

## 📦 Быстрый старт

### Требования
- Python 3.11+
- Node.js 18+
- PostgreSQL 16 (или Docker)

### 1. Клонируй и настрой

```bash
# Скопируй .env
cp .env.example .env
# Заполни TELEGRAM_BOT_TOKEN и другие переменные
```

### 2. Запусти базу данных

```bash
docker compose up db -d
```

### 3. Запусти API

```bash
cd api
pip install -e .
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### 4. Запусти бота

```bash
cd bot
pip install -e .
python -m bot.main
```

### 5. Запусти фронтенд

```bash
cd frontend
npm install
npm run dev
```

### Или всё сразу через Docker:

```bash
docker compose up --build
```

## 📁 Структура проекта

```
Midas/
├── api/                # 🐍 FastAPI Backend
│   ├── app/
│   │   ├── models/     # SQLAlchemy модели
│   │   ├── routers/    # API эндпоинты
│   │   ├── schemas/    # Pydantic схемы
│   │   └── services/   # Бизнес-логика
│   └── tests/
├── bot/                # 🤖 Telegram Bot
│   ├── bot/
│   │   ├── handlers/   # Обработчики команд
│   │   └── keyboards/  # Клавиатуры
│   └── tests/
├── frontend/           # ⚛️ React Mini App
│   └── src/
│       ├── components/ # UI компоненты
│       ├── pages/      # Страницы
│       ├── store/      # Zustand stores
│       └── styles/     # Нео-брутализм CSS
└── PLAN.md             # 📋 Полный план проекта
```

## 🎨 Дизайн

Стиль: **Нео-брутализм** — толстые обводки, яркие цвета, плоские тени.

| Цвет | HEX | Назначение |
|---|---|---|
| 🟣 | `#A855F7` | Primary |
| 🟢 | `#CCFF00` | Accent |
| ⬛ | `#000000` | Borders |
| ⬜ | `#FFFFFF` | Surface |

## 📄 Лицензия

MIT

---

*Сделано с 💜 для подростков, которые хотят быть на коне 👑*
