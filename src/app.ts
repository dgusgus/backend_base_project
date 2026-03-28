import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import rbacRoutes from "./modules/rbac/rbac.routes.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app  = express();
const PORT = process.env.PORT ?? 3000;

// ── Seguridad ──────────────────────────────────────────────────────────────
app.use(helmet());  // Headers HTTP de seguridad (XSS, MIME sniff, etc.)
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));

// ── Parsing ────────────────────────────────────────────────────────────────
app.use(express.json());

// ── Rate limit global ──────────────────────────────────────────────────────
// auth tiene su propio limiter más estricto definido en auth.routes.ts
app.use("/api", apiLimiter);

// ── Rutas ──────────────────────────────────────────────────────────────────
app.use("/auth",  authRoutes);
app.use("/admin", rbacRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Error handler global ───────────────────────────────────────────────────
// DEBE ir al final, después de todas las rutas
app.use(errorHandler);

// ── Inicio ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;