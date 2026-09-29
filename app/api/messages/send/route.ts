import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import Notification from "@/models/Notifications";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      senderId,
      senderName,
      receiverId,
      receiverName,
      message,
    } = body;

    if (
      !senderId ||
      !senderName ||
      !receiverId ||
      !receiverName ||
      !message
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const cleanMessage = String(message).trim();

    if (!cleanMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "Message cannot be empty",
        },
        { status: 400 }
      );
    }

    const conversationId = [String(senderId), String(receiverId)]
      .sort()
      .join("_");

    const newMessage = await Message.create({
      conversationId,
      senderId: String(senderId),
      senderName,
      receiverId: String(receiverId),
      receiverName,
      message: cleanMessage,
      read: false,
    });

    // Create notification for receiver
    await Notification.create({
      userId: String(receiverId),
      type: "message",
      title: `New message from ${senderName}`,
      message: cleanMessage,
      link: "/messages",
      read: false,
    });

    return NextResponse.json({
      success: true,
      message: {
        _id: String(newMessage._id),
        conversationId: newMessage.conversationId,
        senderId: newMessage.senderId,
        senderName: newMessage.senderName,
        receiverId: newMessage.receiverId,
        receiverName: newMessage.receiverName,
        message: newMessage.message,
        read: newMessage.read,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 500 }
    );
  }
}