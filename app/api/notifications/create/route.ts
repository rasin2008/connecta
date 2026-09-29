import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notifications";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      userId,
      type,
      title,
      message,
      link,
    } = body;

    if (!userId || !title || !message) {
      return NextResponse.json(
        {
          success: false,
          message:
            "userId, title and message are required",
        },
        { status: 400 }
      );
    }

    const notification = await Notification.create({
      userId: String(userId),
      type: type || "system",
      title: String(title),
      message: String(message),
      link: link || "/notifications",
      read: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Notification created",
        notification: {
          id: String(notification._id),
          userId: String(notification.userId),
          type: notification.type,
          title: notification.title,
          message: notification.message,
          link: notification.link,
          read: notification.read,
          createdAt: notification.createdAt
            ? new Date(
                notification.createdAt
              ).toISOString()
            : null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create notification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create notification",
      },
      { status: 500 }
    );
  }
}