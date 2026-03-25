import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../backend/models/User.js";

/* ======================
   CONFIG (EDIT HERE)
====================== */

const APP_CONFIG = {
  MONGO_URI: "mongodb+srv://Admin:admin123@cluster0.5icuq.mongodb.net/?appName=Cluster0",

  ADMIN: {
    username: "admin",
    password: "admin123",
  },
};

/* ======================
   RUN SCRIPT
====================== */

const run = async () => {
  try {
    // 🔗 Connect DB
    await mongoose.connect(APP_CONFIG.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // 👤 Create admin if not exists
    const adminExists = await User.findOne({
      username: APP_CONFIG.ADMIN.username,
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(
        APP_CONFIG.ADMIN.password,
        10
      );

      await User.create({
        username: APP_CONFIG.ADMIN.username,
        password: hashedPassword,
      });

      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️ Admin already exists");
    }

    // ✅ Close DB & exit
    await mongoose.disconnect();
    console.log("🚪 DB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
  }
};

// ▶️ RUN DIRECTLY
run();
