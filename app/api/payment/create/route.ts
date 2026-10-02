import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      userId,
      jobId,
      amount,
      method,
    } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          message: "Job ID is required.",
        },
        { status: 400 }
      );
    }

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid payment amount is required.",
        },
        { status: 400 }
      );
    }

    if (
      !["UPI", "Card", "Net Banking"].includes(
        method
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    const payment = await Payment.create({
      userId: String(userId),
      jobId: Number(jobId),
      amount: Number(amount),
      method,
      status: "Success",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Payment successful.",
        payment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE PAYMENT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Payment failed.",
      },
      { status: 500 }
    );
  }
}