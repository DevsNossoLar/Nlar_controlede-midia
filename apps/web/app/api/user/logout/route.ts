import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Remove os cookies de autenticação da requisição atual
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  // E garante que eles sejam apagados no navegador
  const res = NextResponse.json({ message: "Logout realizado com sucesso" });

  res.cookies.set("access_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  res.cookies.set("refresh_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}