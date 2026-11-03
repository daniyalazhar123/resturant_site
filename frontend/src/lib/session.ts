"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: {
        Cookie: `access_token=${token}`,
      },
      cache: "no-store",
    });
    
    if (!res.ok) {
      return null;
    }
    
    const user = await res.json();
    return user;
  } catch (error) {
    return null;
  }
}

export async function login(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Login failed");
    }
    
    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function register(full_name: string, email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ full_name, email, password }),
      credentials: "include",
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Registration failed");
    }
    
    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  
  try {
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    // Ignore errors
  }
}
