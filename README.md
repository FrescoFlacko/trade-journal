# Trading Journal - Full Stack Application

A comprehensive trading journal application for tracking stock options, crypto perps, and swing trades. Built with FastAPI (backend) and React + Vite (frontend).

## Features

- **Trade Logging**: Track trades with detailed information including entry/exit prices, position size, P&L, and more
- **Custom Strategies**: Create and manage trading strategies
- **Image Uploads**: Attach chart screenshots to trades
- **Performance Analytics**: Visualize your trading performance with interactive charts
- **Filtering & Search**: Filter trades by asset type, strategy, and date range
- **Authentication**: Secure JWT-based authentication

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Database for storing trades and strategies
- **SQLAlchemy**: ORM for database operations
- **JWT**: Token-based authentication
- **Pydantic**: Data validation

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **TailwindCSS v4**: Styling
- **shadcn/ui**: UI components
- **Recharts**: Data visualization

## Color Palette

The application uses the **Eunry** color palette - a warm, earthy tone scheme:

- **eunry-50**: `#faf7f6` - Lightest tint
- **eunry-100**: `#f6ecea` - Background
- **eunry-200**: `#efdcd9` - Muted elements
- **eunry-300**: `#e2c4bf`
- **eunry-400**: `#cd9b93` - Secondary/Warm
- **eunry-500**: `#bc8177` - Primary
- **eunry-600**: `#a6665c` - Accent
- **eunry-700**: `#8a544b`
- **eunry-800**: `#744740` - Text/Dark
- **eunry-900**: `#62403a`
- **eunry-950**: `#331f1c` - Darkest shade

### Theme Mapping

- **Background**: eunry-100 (`#f6ecea`)
- **Text/Foreground**: eunry-800 (`#744740`)
- **Primary**: eunry-500 (`#bc8177`)
- **Secondary**: eunry-400 (`#cd9b93`)
- **Accent**: eunry-600 (`#a6665c`)

## Project Structure

```
trade-journal/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Configuration and security
│   │   ├── crud/          # Database operations
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   └── main.py        # FastAPI application
│   ├── uploads/           # Uploaded images
│   ├── requirements.txt   # Python dependencies
│   └── run.py            # Development server script
│
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── lib/          # Utilities and API client
    │   ├── context/      # React context (Auth)
    │   ├── App.jsx       # Main app component
    │   └── main.jsx      # Entry point
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 12+

### Backend Setup

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install postgresql postgresql-contrib

   # macOS
   brew install postgresql
   ```

2. **Create a PostgreSQL database**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE tradejournal;
   CREATE USER tradejournal WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE tradejournal TO tradejournal;
   \q
   ```

3. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

4. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

5. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

6. **Create a `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

7. **Edit the `.env` file** with your configuration:
   ```env
   DATABASE_URL=postgresql://tradejournal:password@localhost:5432/tradejournal
   SECRET_KEY=your-secret-key-here-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   UPLOAD_DIR=uploads
   MAX_UPLOAD_SIZE=5242880
   ```

8. **Run the backend server**:
   ```bash
   python run.py
   ```

   The API will be available at `http://localhost:8000`
   API documentation at `http://localhost:8000/docs`

9. **(Optional) Seed the database with demo data**:
   ```bash
   python seed.py
   ```

   This creates a demo account with sample trades and strategies:
   - **Username**: `demo`
   - **Password**: `demo123`
   - **Email**: `demo@tradejournal.com`

   The seed script creates:
   - 3 sample trading strategies
   - 20 sample trades with realistic data
   - Both open and closed positions

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Usage

### Quick Start with Demo Account

1. **Seed the database** (if you haven't already):
   ```bash
   cd backend
   python seed.py
   ```

2. **Access the application**: Navigate to `http://localhost:5173`

3. **Click "Try Demo Account"** on the login page to instantly access the application with sample data

### Or Create Your Own Account

1. **Register an account**: Navigate to `http://localhost:5173/register` and create a new account
2. **Login**: Use your credentials to login
3. **Create strategies**: Go to the Strategies page and create your trading strategies
4. **Log trades**: Add trades using the "New Trade" button
5. **View analytics**: Check the Dashboard and Analytics pages for performance insights

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token

### Strategies
- `GET /api/strategies/` - Get all strategies
- `POST /api/strategies/` - Create a strategy
- `PUT /api/strategies/{id}` - Update a strategy
- `DELETE /api/strategies/{id}` - Delete a strategy

### Trades
- `GET /api/trades/` - Get all trades
- `GET /api/trades/{id}` - Get a single trade
- `POST /api/trades/` - Create a trade
- `PUT /api/trades/{id}` - Update a trade
- `DELETE /api/trades/{id}` - Delete a trade

### Upload
- `POST /api/upload/` - Upload an image

## Development

### Backend Development

The backend uses FastAPI with SQLAlchemy ORM. Database models are in `backend/app/models/`, and API endpoints are in `backend/app/api/`.

To add a new endpoint:
1. Create a new router in `backend/app/api/`
2. Define the Pydantic schemas in `backend/app/schemas/`
3. Add CRUD operations in `backend/app/crud/`
4. Include the router in `backend/app/main.py`

### Frontend Development

The frontend is built with React and uses React Router for navigation. Components are in `src/components/`, and pages are in `src/pages/`.

To add a new page:
1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Update the navbar in `src/components/layout/Navbar.jsx`

## Production Deployment

### Backend

1. Update the `.env` file with production values
2. Use a production-ready server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
   ```

### Frontend

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Serve the `dist` folder using a web server like Nginx

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
