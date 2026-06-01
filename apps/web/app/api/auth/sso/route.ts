import { NextRequest, NextResponse } from "next/server";
import { cookieSecureForPublicUrl } from "@/utils/cookie-secure";

export async function GET(req: NextRequest) {
  const accessToken = req.nextUrl.searchParams.get("access_token");
  const refreshToken = req.nextUrl.searchParams.get("refresh_token");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://192.168.1.181:3010";
  const cookieSecure = cookieSecureForPublicUrl(appUrl);
  const res = NextResponse.redirect(new URL("/controle-de-midias", appUrl));

  if (accessToken) {
    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: cookieSecure,
    });
  }

  if (refreshToken) {
    res.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: cookieSecure,
    });
  }

  return res;
}

