import type { Request, Response, NextFunction } from "express";

// Este middleware captura cualquier error que llegue via next(error)
// desde cualquier controller o middleware de la app.
// Debe registrarse SIEMPRE al final de app.ts, después de todas las rutas.

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  res.status(500).json({
    error: "Error interno del servidor",
    // Solo mostrar detalle en desarrollo
    ...(process.env.NODE_ENV === "development" && { detail: err.message }),
  });
}