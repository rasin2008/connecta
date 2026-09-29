import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notifications";

export async function GET(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
          notifications: [],
          unreadCount: 0,
        },
        { status: 400 }
      );
    }

    const notifications = await Notification.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const result = notifications.map((item) => ({
      id: String(item._id),
      userId: String(item.userId),
      type: item.type,
      title: item.title,
      message: item.message,
      link: item.link || "/notifications",
      read: Boolean(item.read),
      createdAt: item.createdAt
        ? new Date(item.createdAt).toISOString()
        : null,
      updatedAt: item.updatedAt
        ? new Date(item.updatedAt).toISOString()
        : null,
    }));

    const unreadCount = result.filter(
      (item) => !item.read
    ).length;

    return NextResponse.json({
      success: true,
      notifications: result,
      unreadCount,
    });
  } catch (error) {
    console.error("GET notifications error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load notifications",
        notifications: [],
        unreadCount: 0,
      },
      { status: 500 }
    );
  }
}