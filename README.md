# Telegram Weather Bot

A multilingual Telegram bot that provides current weather information based on user location.

## Tech Stack

- **Node.js** - Runtime
- **Telegraf** - Telegram Bot Framework  
- **PostgreSQL** - User data and language preferences
- **OpenWeatherMap API** - Weather data
- **Jest** - Testing

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL database
- Telegram Bot Token (from @BotFather)
- OpenWeatherMap API Key (free tier)

### Installation
```bash
# Clone and install
git clone https://github.com/VladHordiienko1993/telegram-weather-bot.git
cd telegram-weather-bot
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your tokens and database URL

# Run database migration
node src/database/migrate.js
```

### Environment Variables
```env
BOT_TOKEN=your_telegram_bot_token_here
WEATHER_API_KEY=your_openweathermap_api_key_here
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=development
```

## How to Run Locally
```bash
npm start
```

## How to Deploy

### Render.com
1. Create PostgreSQL database on Render
2. Connect GitHub repo to Render (Background Worker)
3. Set environment variables in Render dashboard
4. Deploy automatically

## Testing
```bash
npm test
```

## Bot Usage
1. Send `/start` to begin
2. Send your location (GPS) or type city name
3. Receive weather information
4. Use `/help` for commands
5. Use `/lang` to change language (English/Russian/Ukrainian/Polish)