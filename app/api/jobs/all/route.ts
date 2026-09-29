import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/JobModel";

export async function GET() {
  try {
    await dbConnect();

    const jobs = await Job.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        jobs,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load jobs",
        jobs: [],
      },
      {
        status: 500,
      }
    );
  }
}