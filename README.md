## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js] (v16 or higher)
- [npm] (comes with Node.js)
- [PostgreSQL] (for the database)

## Project Structure

```
GameKeyMarketplace/
├── backendServer/     # Express.js backend API
├── frontendserver/    # React TypeScript frontend
└── README.md
```

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backendServer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```

4. Open the `.env` file and update the values:
   ```env
   PORT=3030
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=GameKeyMarketplace
   NODE_ENV=development
   ```

5. Set up your PostgreSQL database and ensure the connection details match your `.env` configuration.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontendserver
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```

4. Open the `.env` file and update if needed (default values should work for local development):
   ```env
   REACT_APP_API_URL=http://localhost:3030/api/
   PORT=3300
   ```

## Launching the Application

### Start the Backend Server

From the `backendServer` directory:

```bash
# Production mode
npm start
# Or
node server.js

# Development mode (with auto-reload)
npm run dev
```

The backend server will run on `http://localhost:3030` (or the port specified in your `.env` file).

### Start the Frontend Server

From the `frontendserver` directory:

```bash
npm start
```

The React development server will run on `http://localhost:3300` (or the port specified in your `.env` file) and will automatically open in your browser.

## Functionality

### Fuzzy Search for Games

- **Real-time Search**: As you type in the search bar, results appear
- **Fuzzy Matching**: The search algorithm matches game titles even with typos or partial matches
- **Platform & Region Filtering**: Search results can include platform-specific (PC, PlayStation, Xbox, etc.) and region-specific results
- **Dropdown Preview**: View up to 10 instant results in a dropdown as you type
- **Full Results Page**: Click "Show All Results" to view all matching games on a dedicated results page'
- **Dynamic Region Availability**: Game region availability calculated by users IP address

### Browse Games

- View featured games on the home page
- Navigate to the game list page to see all available games
- Each game displays with relevant information including title, platform, and region availability

## Technology Stack

### Frontend
- React 19.2.3
- TypeScript
- React Router DOM
- React Bootstrap
- Axios (API communication)
- Bootstrap Icons & Flag Icons

### Backend
- Node.js
- Express.js 5.2.1
- PostgreSQL (with pg client)
- Helmet (security)
- CORS
- Express Rate Limiter
- Express Validator

## API Endpoints

- `GET /api/list` - Retrieve all games
- `GET /api/list?search=<query>` - Search for games with fuzzy matching
