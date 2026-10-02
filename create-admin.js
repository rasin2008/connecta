const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("dotenv").config({
  path: ".env.local",
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["student", "business", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", UserSchema);

async function createAdmin() {
  try {
    console.log("");
    console.log("================================");
    console.log("CONNECTA ADMIN SETUP");
    console.log("================================");
    console.log("");

    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected!");
    console.log("");

    const email = "admin@connecta.com";
    const password = "admin123";

    let admin = await User.findOne({
      email,
    });

    if (admin) {
      console.log("Admin account already exists.");

      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      admin.name = "CONNECTA Admin";
      admin.password = hashedPassword;
      admin.role = "admin";

      await admin.save();

      console.log("✅ Existing account updated.");
    } else {
      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      admin = await User.create({
        name: "CONNECTA Admin",
        email,
        password: hashedPassword,
        phone: "",
        location: "",
        education: "",
        role: "admin",
      });

      console.log("✅ New admin account created.");
    }

    console.log("");
    console.log("================================");
    console.log("CONNECTA ADMIN LOGIN");
    console.log("================================");
    console.log("Email    :", email);
    console.log("Password :", password);
    console.log("Role     :", admin.role);
    console.log("================================");
    console.log("");

    await mongoose.disconnect();

    console.log("✅ MongoDB disconnected.");
    console.log("✅ Admin setup completed.");
  } catch (error) {
    console.error("");
    console.error("❌ CREATE ADMIN ERROR");
    console.error("--------------------------------");
    console.error(error);
    console.error("--------------------------------");
    console.error("");

    process.exit(1);
  }
}

createAdmin();