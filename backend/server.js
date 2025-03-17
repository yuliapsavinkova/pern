import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import tradesRoutes from "./routes/tradesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Getting the script's folder path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Enables JSON body parsing.
app.use(express.json());

// CORS Middleware
app.use(
  cors(/*{
    origin: "https://yourfrontend.com",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  }*/)
);

// app.use((req, res, next) => {
//   res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' https://pern-3syx.onrender.com");
//   next();
// });

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Only allow loading content from the same origin
        scriptSrc: ["'self'", "trusted-scripts.com"], // Allow scripts from the same origin and trusted source
        connectSrc: ["'self'", "https://pern-3syx.onrender.com"], // Allow connections to your backend API
      },
    },
    frameguard: { action: "deny" }, // Disallow iframe embedding
  })
);

// Log the requests
app.use(morgan("dev"));

app.use("/api/trades", tradesRoutes);

// Serve static files (e.g., CSS, JS, images)
app.use(express.static(path.join(__dirname, "../frontend", "dist")));

// Handle client-side routing by sending index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
