import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Notification from "@/models/Notifications";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      userId,
      jobId,
      amount,
      method,
    } = body;

    // Required fields
    if (!userId || jobId === undefined || !amount || !method) {
      return NextResponse.json(
        {
          success: false,
          message: "All payment fields are required.",
        },
        { status: 400 }
      );
    }

    // Validate amount
    const numericAmount = Number(amount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment amount.",
        },
        { status: 400 }
      );
    }

    // Allowed demo payment methods
    const allowedMethods = [
      "UPI",
      "Card",
      "Net Banking",
    ];

    if (!allowedMethods.includes(method)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    // Create demo payment
    const payment = await Payment.create({
      userId,
      jobId: Number(jobId),
      amount: numericAmount,
      method,
      status: "Success",
    });

    // -----------------------------------------
    // PAYMENT SUCCESS NOTIFICATION
    // -----------------------------------------

    await Notification.create({
      userId,
      type: "payment",
      title: "Payment Successful",
      message: `Your payment of ₹${numericAmount} was successful.`,
      link: "/wallet",
      read: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Demo payment successful.",
        payment: {
          id: payment._id.toString(),
          userId: payment.userId,
          jobId: payment.jobId,
          amount: payment.amount,
          method: payment.method,
          status: payment.status,
          createdAt: payment.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("DEMO PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Demo payment failed.",
      },
      { status: 500 }
    );
  }
}