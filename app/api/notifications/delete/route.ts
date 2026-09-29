import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notifications";

export async function DELETE(request: Request) {
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

    const deleted =
      await Notification.findByIdAndDelete(
        notificationId
      );

    if (!deleted) {
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
      message: "Notification deleted",
    });
  } catch (error) {
    console.error(
      "Delete notification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete notification",
      },
      { status: 500 }
    );
  }
}