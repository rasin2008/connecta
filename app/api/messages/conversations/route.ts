import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const otherUserId = searchParams.get("otherUserId");

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

    const messages = await Message.find({
      conversationId,
    })
      .sort({ createdAt: 1 })
      .lean();

    const formattedMessages = messages.map((item) => ({
      _id: String(item._id),
      conversationId: item.conversationId,
      senderId: item.senderId,
      senderName: item.senderName,
      receiverId: item.receiverId,
      receiverName: item.receiverName,
      message: item.message,
      read: item.read,
      createdAt: item.createdAt,
    }));

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("CONVERSATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load conversation",
      },
      { status: 500 }
    );
  }
}