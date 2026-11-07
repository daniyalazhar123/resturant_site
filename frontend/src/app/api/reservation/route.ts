import { NextResponse } from "next/server";
import { z } from "zod";

const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");

const reservationSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(7, "Phone number is required").max(25),
  date: z.string().min(1, "Date is required").max(20),
  time: z.string().min(1, "Time slot is required").max(10),
  guests: z.coerce.number().int().min(1, "At least 1 guest").max(20, "Maximum 20 guests"),
  requests: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = reservationSchema.parse(body);

    // Forward to the real FastAPI backend. The session cookie (if any) is passed
    // through so authenticated users get the reservation linked to their account.
    const cookie = request.headers.get("cookie");
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/reservations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: data.guests,
        requests: data.requests || null,
      }),
      cache: "no-store",
    });

    const result = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            backendRes.status === 429
              ? "Too many reservation attempts. Please wait a minute and try again."
              : "Reservation could not be completed. Please check your details.",
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        reference_code: result.reference_code,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An internal error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
