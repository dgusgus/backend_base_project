import "dotenv/config";
import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import rbacRoutes from "./modules/rbac/rbac.routes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// ── Middlewares globales ───────────────────────────────────────────────────
app.use(express.json());

// ── Rutas ──────────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/admin", rbacRoutes);

// Ruta de salud
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Inicio ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;