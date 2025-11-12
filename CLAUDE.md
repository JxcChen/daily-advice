# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered daily motivational quote generation system that creates personalized, poetic quotes based on user information, date/time, weather conditions, and user mood. The system features a dark Chinese aesthetic theme with ink-wash style visuals and scroll animation effects.

**Tech Stack**: Flask 3.0 (Backend) + Next.js 14 (Frontend) + DeepSeek AI + 和风天气 API

## Development Commands

### Backend (Flask)
```bash
cd backend

# Setup environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Database migrations
flask db upgrade

# Run development server
python run.py  # Runs on http://localhost:5001
```

### Frontend (Next.js)
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev  # Runs on http://localhost:3000 or 3001

# Production build
npm run build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Quick Start (Both Services)
```bash
# From project root
chmod +x start.sh
./start.sh

# Stop all services
./stop.sh
```

## Architecture Overview

### Backend Architecture
**Core Pattern**: Service layer architecture with separation of concerns

**Directory Structure**:
- `app/models/` - SQLAlchemy ORM models (User, QuoteHistory)
- `app/api/` - Flask Blueprint routes (auth, quote, user endpoints)
- `app/services/` - Business logic layer
  - `auth_service.py` - User registration, login, JWT token generation
  - `ai_service.py` - DeepSeek API integration for quote generation
  - `weather_service.py` - 和风天气 API integration with caching
  - `quote_service.py` - Core quote generation orchestration, birthday detection, emotion recognition
- `app/utils/` - Shared utilities (response formatter, validators, logger)
- `app/config/` - Environment-specific configuration
- `app/extensions.py` - Flask extension initialization (SQLAlchemy, JWT, CORS, Limiter)

**Key Design Principles**:
- All API responses follow unified format: `{code, message, data}`
- JWT-based authentication with Bearer token
- bcrypt password hashing (12 rounds)
- Input validation using marshmallow schemas
- Rate limiting with Flask-Limiter (10/min, 100/hour for quote generation)
- Structured logging with rotating file handlers (10MB, 5 backups)

### Frontend Architecture
**Framework**: Next.js 14 with App Router, TypeScript, TailwindCSS

**Directory Structure**:
- `src/app/` - Next.js App Router pages
  - `api/` - API route handlers
  - `login/`, `register/` - Authentication pages
  - `quote/` - Quote generation main page
  - `history/` - Quote history listing
- `src/components/` - React components
  - `ui/` - Base UI components (Button, Input, Modal, Loading)
  - `auth/` - Authentication forms
  - `quote/` - Quote display and input components
  - `layout/` - Layout components
- `src/lib/` - Application logic
  - `api/` - Axios client and API wrappers
  - `hooks/` - Custom React hooks (useAuth, useWeather, useGeolocation)
  - `store/` - Zustand state management (authStore, quoteStore)
  - `utils/` - Utility functions
  - `constants/` - Application constants
- `src/types/` - TypeScript type definitions
- `src/styles/` - Global styles and animations

**State Management**: Zustand for auth and quote state
**Styling**: TailwindCSS + custom CSS for animations
**Animation**: Framer Motion for scroll animations and typewriter effects

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration (phone, password, name, gender, birthday)
- `POST /api/v1/auth/login` - User login, returns JWT access_token

### Quote Generation
- `POST /api/v1/quote/generate` - Generate personalized daily quote
  - Requires: Bearer token
  - Optional body: `{event, mood, city, latitude, longitude}`
  - Returns: Quote content, emotion icon/color, weather, is_birthday flag
- `GET /api/v1/quote/history?page=1&per_page=10` - Get quote history with pagination

### User
- `GET /api/v1/user/profile` - Get current user profile

## Key Features Implementation

### Birthday Detection System
The system has three states handled in `quote_service.py`:
1. **Today is birthday**: Generates special birthday greeting quotes
2. **Birthday within 3 days**: Generates anticipation-themed quotes
3. **Normal day**: Standard motivational quotes

### Emotion Recognition
Supports 8 emotion types with corresponding emoji and colors:
- 开心 (Happy): 😊 #d4af37 (Gold)
- 平静 (Calm): 😌 #00ced1 (Cyan)
- 疲惫 (Tired): 😔 #808080 (Gray)
- 焦虑 (Anxious): 😰 #4169e1 (Blue)
- 愤怒 (Angry): 😤 #dc143c (Red)
- 伤心 (Sad): 😢 #9370db (Purple)
- 期待 (Expectant): 🤩 #ff8c00 (Orange)
- 默认 (Default): 🧘 #ffffff (White)

See `app/services/quote_service.py:_get_emotion_info()` for implementation.

### AI Quote Generation Flow
1. Collect user info (name, age, gender from User model)
2. Check birthday status (today/upcoming/normal)
3. Fetch weather data via weather_service (cached 1 hour)
4. Build structured prompt incorporating all context
5. Call DeepSeek API with temperature=0.8, max_tokens=200
6. Return quote with metadata (emotion, weather, timestamp)

Implementation in `ai_service.py:generate_quote()` and orchestrated by `quote_service.py:generate_daily_quote()`.

## Environment Variables

### Backend (.env)
```bash
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key

# Database
DATABASE_URL=sqlite:///dev.db  # Dev: SQLite, Prod: PostgreSQL

# External APIs
DEEPSEEK_API_KEY=sk-xxx  # DeepSeek AI API key
QWEATHER_API_KEY=your-key  # 和风天气 API key

# Optional
REDIS_URL=redis://localhost:6379/0  # For rate limiting
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

## Database Schema

### users table
- `id` (Primary Key)
- `phone` (Unique, 11 digits)
- `password_hash` (bcrypt hashed)
- `name`, `gender`, `birthday`
- `created_at`, `last_login_at`

### quote_history table
- `id` (Primary Key)
- `user_id` (Foreign Key → users.id)
- `quote_content` (TEXT)
- `event_input`, `mood_input` (Optional user inputs)
- `weather`, `temperature`, `city`
- `is_birthday` (Boolean)
- `created_at`

## Testing

### Backend API Testing
```bash
# Test registration
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000", "password": "Test1234", "name": "张三", "gender": "male", "birthday": "1995-06-15"}'

# Test login
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000", "password": "Test1234"}'

# Test quote generation (requires token from login)
curl -X POST http://localhost:5001/api/v1/quote/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"event": "今天要面试", "mood": "有点紧张", "city": "北京"}'
```

See `docs/后端测试文档.md` for comprehensive testing guide.

## Design Specifications

### Visual Theme
- **Style**: Dark Chinese aesthetic with ink-wash elements
- **Background**: Dark tones (#0a0a0a ~ #1a1a1a)
- **Accent Colors**: Gold (#d4af37), Cyan (#00ced1), Red (#dc143c)
- **Fonts**:
  - Chinese: 方正清刻本悦宋, 站酷快乐体
  - English: Cinzel, EB Garamond

### Animation Effects
- Scroll unrolling animation (3 seconds)
- Typewriter effect for text display
- 3D rotation entrance for emotion emoji
- Glow effects on interactive elements

## Common Issues

### JWT Authentication Errors
If you encounter "get_jwt_identity() not working":
- Ensure JWT_SECRET_KEY is set consistently in .env
- Check token format: `Authorization: Bearer <token>`
- Verify token hasn't expired (7-day expiry by default)

### Port Conflicts
Backend runs on port 5001 (not 5000) due to macOS AirPlay using port 5000.

### Weather API Failures
Weather service has fallback to default values if API fails or quota exceeded. Check cache TTL is set to 3600 seconds (1 hour).

## Deployment

### Development
Use `./start.sh` to run both services. Logs saved to `logs/backend.log` and `logs/frontend.log`.

### Production
- **Frontend**: Deploy to Vercel (auto-detects Next.js)
  - Root directory: `frontend`
  - Environment: `NEXT_PUBLIC_API_URL=<backend-url>`
- **Backend**: Deploy to Railway/Render
  - Root directory: `backend`
  - Build: `pip install -r requirements.txt`
  - Start: `gunicorn run:app`
  - Add PostgreSQL database
  - Run migrations: `flask db upgrade`

See `DEPLOYMENT.md` and `RENDER_DEPLOY.md` for detailed deployment instructions.

## Project Status

### Completed ✅
- Complete backend API (auth, quote generation, history)
- Database models and migrations
- DeepSeek AI integration
- Weather API integration
- Birthday detection logic
- Emotion recognition system
- Frontend React components and pages
- JWT authentication flow

### In Progress 🔄
- Frontend-backend integration refinements
- Chinese aesthetic UI polish
- Animation implementations

### Documentation
- `docs/产品需求文档.md` - Complete product requirements
- `docs/技术规范文档.md` - Technical specifications and coding standards
- `docs/开发计划.md` - Development roadmap and milestones
- `docs/后端测试文档.md` - API testing guide

## Development Notes

- **Backend port**: 5001 (5000 is occupied by AirPlay on macOS)
- **Test account**: Phone: 13800138000, Password: Test1234
- **Password requirements**: 8-20 chars, must contain letters and numbers
- **Quote length**: AI generates 30-60 character quotes
- **Database**: Development uses SQLite (`backend/dev.db`), production should use PostgreSQL
- **Caching**: Weather data cached 1 hour via decorators
- **Rate limiting**: 10 requests/min, 100 requests/hour for quote generation
