import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "userId is required",
        },
        { status: 400 }
      );
    }

    const messages = await Message.find({
      $or: [
        { senderId: String(userId) },
        { receiverId: String(userId) },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const conversationMap = new Map();

    for (const item of messages) {
      const otherUserId =
        item.senderId === String(userId)
          ? item.receiverId
          : item.senderId;

      const otherUserName =
        item.senderId === String(userId)
          ? item.receiverName
          : item.senderName;

      if (!conversationMap.has(item.conversationId)) {
        conversationMap.set(item.conversationId, {
          conversationId: item.conversationId,
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: item.message,
          lastMessageTime: item.createdAt,
          unreadCount: 0,
        });
      }

      if (
        item.receiverId === String(userId) &&
        item.read === false
      ) {
        conversationMap.get(item.conversationId).unreadCount += 1;
      }
    }

    return NextResponse.json({
      success: true,
      conversations: Array.from(conversationMap.values()),
    });
  } catch (error) {
    console.error("CONVERSATIONS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load conversations",
      },
      { status: 500 }
    );
  }
}