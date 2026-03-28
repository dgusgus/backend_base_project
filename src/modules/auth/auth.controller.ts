import type { Request, Response } from "express";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "./auth.service.js";

// validate middleware ya parseó y validó req.body antes de llegar aquí

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al registrar";
    res.status(409).json({ error: message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al iniciar sesión";
    res.status(401).json({ error: message });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const result = await refreshAccessToken(req.body.refreshToken);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al refrescar token";
    res.status(401).json({ error: message });
  }
}

export async function logout(req: Request, res: Response) {
  await logoutUser(req.body.refreshToken);
  // Siempre 200 aunque el token no existiera (idempotente)
  res.status(200).json({ message: "Sesión cerrada" });
}