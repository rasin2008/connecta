import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/JobModel";
import Notification from "@/models/Notifications";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      userId,
      jobId,
      title,
      company,
      location,
      pay,
      duration,
    } = body;

    if (
      !userId ||
      jobId === undefined ||
      !title ||
      !company ||
      !location ||
      !pay ||
      !duration
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All application fields are required.",
        },
        { status: 400 }
      );
    }

    // Check already applied
    const existingApplication = await Application.findOne({
      userId,
      jobId,
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already applied for this job.",
        },
        { status: 409 }
      );
    }

    // Find the job
    const job = await Job.findOne({
      jobId: Number(jobId),
    }).lean();

    // Create application
    const application = await Application.create({
      userId,
      jobId: Number(jobId),
      title,
      company,
      location,
      pay,
      duration,
      status: "Applied",
    });

    // ------------------------------------------------
    // CREATE NOTIFICATION FOR BUSINESS
    // ------------------------------------------------

    if (job?.postedBy) {
      await Notification.create({
        userId: job.postedBy,
        type: "application",
        title: "New Job Application",
        message: `A student has applied for "${title}".`,
        link: "/business-applications",
        read: false,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
        application: {
          id: application._id.toString(),
          userId: application.userId,
          jobId: application.jobId,
          title: application.title,
          company: application.company,
          location: application.location,
          pay: application.pay,
          duration: application.duration,
          status: application.status,
          createdAt: application.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit application.",
      },
      { status: 500 }
    );
  }
}