# PERN Stack Trading App

## Overview

This project is a **PERN (PostgreSQL, Express, React, Node.js) stack application** designed to track trades and visualize financial data. The backend fetches trade data from Google Sheets, stores it in a **PostgreSQL database (hosted on NEON)**, and serves the data through an **Express API**. The frontend, built with **React and Vite**, provides a responsive and user-friendly interface for managing and analyzing trades.

## Technologies Used

### **Backend**

- **Node.js & Express.js** – Server-side API
- **PostgreSQL (NEON)** – Database
- **pg** – PostgreSQL client for Node.js
- **Google Sheets API** – Fetch trade data
- **dotenv** – Environment variable management
- **cors, helmet, morgan** – Security & logging middleware

### **Frontend**

- **React** – UI framework
- **Vite** – Fast development build tool
- **React Router** – Client-side routing
- **TanStack React Query** – Data fetching and state management
- **Axios** – API requests
- **ESLint & Prettier** – Code quality tools

### **Deployment**

- **Render** – Hosting for both frontend and backend
- **NEON** – Cloud-hosted PostgreSQL database

## Setup Instructions

### **1. Clone the Repository**

```sh
git clone https://github.com/your-username/pern.git
cd pern
```

### **2. Set Up Environment Variables**

Create a `.env` file in the `backend` folder and add:

```sh
DATABASE_URL=your_neon_postgres_url
GOOGLE_SERVICE_ACCOUNT=path_to_google_service_account.json
```

### **3. Install Dependencies**

```sh
npm install       # Root dependencies
npm install --prefix frontend  # Frontend dependencies
```

### **4. Set Up the Database**

```sh
npm run setup-db      # Creates and seeds the database
npm run setup-db-google  # Seeds from Google Sheets
```

### **5. Run the Application**

```sh
npm run dev    # Start backend with Nodemon
npm run dev --prefix frontend  # Start frontend
```

### **6. Build and Deploy**

```sh
npm run build  # Builds frontend for production
```

## API Endpoints

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| GET    | `/api/trades`     | Fetch all trades |
| POST   | `/api/trades`     | Add a new trade  |
| DELETE | `/api/trades/:id` | Remove a trade   |

## Deployment

- **Backend:** Deployed on Render (`https://your-backend.onrender.com`)
- **Frontend:** Deployed on Render (`https://your-frontend.onrender.com`)

## License

This project is licensed under the MIT License.
