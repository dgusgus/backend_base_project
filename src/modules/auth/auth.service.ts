import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma.js";
import type { RegisterInput, LoginInput } from "./auth.schema.js";

// ── Tipos ──────────────────────────────────────────────────────────────────
export interface TokenPayload {
  sub: number;   // id del usuario
  email: string;
  role: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret_change_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

// ── Servicios ──────────────────────────────────────────────────────────────
export async function registerUser(input: RegisterInput) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) {
    throw new Error("El email ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      password: hashedPassword,
      // role: USER por defecto (definido en el schema)
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  return { user, token };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    // Mismo mensaje para no revelar si el email existe
    throw new Error("Credenciales inválidas");
  }

  const validPassword = await bcrypt.compare(input.password, user.password);
  if (!validPassword) {
    throw new Error("Credenciales inválidas");
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  const { password: _password, ...safeUser } = user;

  return { user: safeUser, token };
}