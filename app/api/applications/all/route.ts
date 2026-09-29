import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";

export async function GET() {
  try {
    await dbConnect();

    const applications = await Application.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("GET ALL APPLICATIONS ERROR:", error);

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