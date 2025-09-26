// src/lib/mongodb.ts
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/foodstore";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Tambahkan tipe ke global
declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

let cached = global.mongooseConn;

if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default dbConnect;
