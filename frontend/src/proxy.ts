import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function verifyJwtToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [headerB64, payloadB64, signatureB64] = parts;
    const headerJson = new TextDecoder().decode(base64UrlToUint8Array(headerB64));
    const payloadJson = new TextDecoder().decode(base64UrlToUint8Array(payloadB64));

    const header = JSON.parse(headerJson);
    const payload = JSON.parse(payloadJson);

    if (header.alg !== "HS256") return false;
    if (payload.type !== "access") return false;
    if (!payload.sub || Number.isNaN(Number(payload.sub))) return false;
    if (typeof payload.exp !== "number" || payload.exp * 1000 <= Date.now()) {
      return false;
    }

    const secret = (process.env.JWT_SECRET || "").trim();
    if (!secret || secret.length < 32) {
      // Fail closed if JWT_SECRET is not configured on the frontend server
      return false;
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlToUint8Array(signatureB64);

    return await crypto.subtle.verify("HMAC", key, signature.buffer as ArrayBuffer, data);
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/checkout")) {
    const isValid = token ? await verifyJwtToken(token) : false;
    if (!isValid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        response.cookies.delete("access_token");
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*"],
};
