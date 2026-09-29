import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      name,
      email,
      password,
      phone,
      location,
      education,
      role,
    } = body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and password are required.",
        },
        { status: 400 }
      );
    }

    const selectedRole =
      role === "business" ? "business" : "student";

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered.",
        },
        { status: 409 }
      );
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      phone: phone?.trim() || "",
      location: location?.trim() || "",
      education: education?.trim() || "",
      role: selectedRole,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          location: user.location || "",
          education: user.education || "",
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed.",
      },
      { status: 500 }
    );
  }
}