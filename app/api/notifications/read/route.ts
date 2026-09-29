import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notifications";

export async function PUT(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification ID is required",
        },
        { status: 400 }
      );
    }

    const notification =
      await Notification.findByIdAndUpdate(
        notificationId,
        {
          $set: {
            read: true,
          },
        },
        {
          new: true,
        }
      ).lean();

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Read notification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark notification as read",
      },
      { status: 500 }
    );
  }
}