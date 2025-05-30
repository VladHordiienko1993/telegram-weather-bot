# Telegram Weather Bot

A Telegram bot that provides current weather information based on user location.

## Tech Stack

- **Node.js** - Runtime
- **Telegraf** - Telegram Bot Framework  
- **OpenWeatherMap API** - Weather data
- **Jest** - Testing

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- Telegram Bot Token (from @BotFather)
- OpenWeatherMap API Key (free tier)

### Installation
```bash
# Clone and install
git clone <repo-url>
cd telegram-weather-bot
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your tokens
```

### Environment Variables
```env
BOT_TOKEN=your_telegram_bot_token_here
WEATHER_API_KEY=your_openweathermap_api_key_here
NODE_ENV=development
```

## How to Run Locally
```bash
npm start
```

## How to Deploy

### Render.com
1. Connect GitHub repo to Render
2. Set environment variables in Render dashboard
3. Deploy automatically

## Testing
```bash
npm test
```

## Bot Usage
1. Send `/start` to begin
2. Send your location (GPS) or type city name
3. Receive weather information
4. Use `/help` for commands