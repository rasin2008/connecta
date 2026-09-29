import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";

export async function GET(request: NextRequest) {
  try {
    // Connect MongoDB
    await dbConnect();

    // Get userId from URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check userId
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
          applications: [],
        },
        { status: 400 }
      );
    }

    // Get user's applications
    const applications = await Application.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(
      "GET APPLICATIONS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load applications",
        applications: [],
      },
      { status: 500 }
    );
  }
}