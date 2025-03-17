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

// Security Middleware
app.use(
  helmet(/*{
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],  // Only allow loading content from the same origin
        scriptSrc: ["'self'", 'trusted-scripts.com'],  // Allow scripts from the same origin and a trusted source
      },
    },
    frameguard: { action: 'deny' },  // Disallow iframe embedding
  }*/)
);

// Log the ruquests
app.use(morgan("dev"));

app.use("/api/trades", tradesRoutes);

// app.get("/", (req, res) => {
//   res.send("Server is running...");
// });

// If need to deploy server and client together
app.use(express.static(path.join(__dirname, "../frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
