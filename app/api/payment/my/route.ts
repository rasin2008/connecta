import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    const payments = await Payment.find({
      userId: String(userId),
    })
      .sort({ createdAt: -1 })
      .lean();

    const totalAmount = payments
      .filter(
        (payment) => payment.status === "Success"
      )
      .reduce(
        (total, payment) =>
          total + Number(payment.amount || 0),
        0
      );

    return NextResponse.json(
      {
        success: true,
        payments,
        totalAmount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET MY PAYMENTS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load payments.",
      },
      { status: 500 }
    );
  }
}