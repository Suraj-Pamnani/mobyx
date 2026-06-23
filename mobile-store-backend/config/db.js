const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("Database Error: MONGO_URI is not set in environment variables.");
      // Avoid crashing the whole server during frontend dev.
      return;
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database Error:", error.message);
    // Avoid hard crash; let server start and report errors on DB operations.
  }
};


module.exports = connectDB;