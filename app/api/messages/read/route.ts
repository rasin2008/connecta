import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      userId,
      otherUserId,
    } = body;

    if (!userId || !otherUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "userId and otherUserId are required",
        },
        { status: 400 }
      );
    }

    const conversationId = [String(userId), String(otherUserId)]
      .sort()
      .join("_");

    await Message.updateMany(
      {
        conversationId,
        receiverId: String(userId),
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("READ MESSAGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark messages as read",
      },
      { status: 500 }
    );
  }
}