import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Notification from "@/models/Notifications";

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const { applicationId, status } = body;

    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Application ID is required",
        },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required",
        },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "Applied",
      "Under Review",
      "Accepted",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid application status",
        },
        { status: 400 }
      );
    }

    // Find application first
    const existingApplication = await Application.findById(
      applicationId
    );

    if (!existingApplication) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found",
        },
        { status: 404 }
      );
    }

    // Update application status
    existingApplication.status = status;

    await existingApplication.save();

    // -----------------------------------------
    // CREATE NOTIFICATION FOR STUDENT
    // -----------------------------------------

    let notificationTitle = "";
    let notificationMessage = "";

    if (status === "Under Review") {
      notificationTitle = "Application Under Review";

      notificationMessage = `Your application for "${existingApplication.title}" is now under review.`;
    }

    if (status === "Accepted") {
      notificationTitle = "Application Accepted";

      notificationMessage = `Congratulations! Your application for "${existingApplication.title}" has been accepted.`;
    }

    // Only create notification for meaningful status changes
    if (
      status === "Under Review" ||
      status === "Accepted"
    ) {
      await Notification.create({
        userId: existingApplication.userId,
        type: "application",
        title: notificationTitle,
        message: notificationMessage,
        link: "/my-applications",
        read: false,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application status updated successfully",
        application: {
          id: existingApplication._id.toString(),
          userId: existingApplication.userId,
          jobId: existingApplication.jobId,
          title: existingApplication.title,
          company: existingApplication.company,
          location: existingApplication.location,
          pay: existingApplication.pay,
          duration: existingApplication.duration,
          status: existingApplication.status,
          createdAt: existingApplication.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "UPDATE APPLICATION STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update application status",
      },
      { status: 500 }
    );
  }
}