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

The application features a powerful search system that allows users to find games easily:

- **Real-time Search**: As you type in the search bar, results appear instantly with a 300ms debounce for optimal performance
- **Fuzzy Matching**: The search algorithm intelligently matches game titles even with typos or partial matches
- **Platform & Region Filtering**: Search results can include platform-specific (PC, PlayStation, Xbox, etc.) and region-specific results
- **Dropdown Preview**: View up to 10 instant results in a dropdown as you type
- **Full Results Page**: Click "Show All Results" to view all matching games on a dedicated results page
- **Search Suggestions**: If no results are found, the app provides helpful suggestions and allows browsing the full catalog

### Browse Games

- View featured games on the home page
- Navigate to the game list page to see all available games
- Each game displays with relevant information including title, platform, and region availability

### User Interface Features

- **Responsive Design**: Built with Bootstrap and React Bootstrap for mobile-friendly layouts
- **Country Flags**: Visual region indicators using flag icons
- **Loading States**: Smooth loading animations for better user experience
- **Navigation**: Easy-to-use navbar with routing between pages

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

## Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

### Frontend
- `npm start` - Start the development server
- `npm run build` - Build the app for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## API Endpoints

- `GET /api/list` - Retrieve all games
- `GET /api/list?search=<query>` - Search for games with fuzzy matching

## License

ISC
