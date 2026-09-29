import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/JobModel";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      title,
      company,
      description,
      category,
      location,
      pay,
      duration,
      postedBy,
    } = body;

    if (
      !title ||
      !company ||
      !description ||
      !category ||
      !location ||
      !pay ||
      !duration ||
      !postedBy
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All job fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    const jobId = Date.now();

    const job = await Job.create({
      jobId,
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      category: category.trim(),
      location: location.trim(),
      pay: pay.trim(),
      duration: duration.trim(),
      postedBy,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Job posted successfully.",
        job,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to post job.",
      },
      {
        status: 500,
      }
    );
  }
}