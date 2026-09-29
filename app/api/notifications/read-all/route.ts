import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notifications";

export async function PUT(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    await Notification.updateMany(
      {
        userId: String(userId),
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
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Read all notifications error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to mark all notifications as read",
      },
      { status: 500 }
    );
  }
}