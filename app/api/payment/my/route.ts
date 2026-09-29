import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
          payments: [],
        },
        { status: 400 }
      );
    }

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const totalAmount = payments
      .filter((payment) => payment.status === "Success")
      .reduce((total, payment) => total + payment.amount, 0);

    return NextResponse.json({
      success: true,
      totalAmount,
      payments,
    });
  } catch (error) {
    console.error("GET PAYMENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load payments",
        payments: [],
      },
      { status: 500 }
    );
  }
}