import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";

// PostgreSQL (Prisma)
export const db = new PrismaClient();

db.$connect()
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err);
    process.exit(1);
  });

// MongoDB (Mongoose)
export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

/**
 * Get a raw MongoDB collection (for operations outside Mongoose models)
 * @param {string} collectionName
 */
export const getMongoCollection = (collectionName) => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB not connected");
  }
  return mongoose.connection.db.collection(collectionName);
};
