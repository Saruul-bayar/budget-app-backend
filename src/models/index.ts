import mongoose from "mongoose";

export async function connectToDB(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable was not set");
    process.exit(1);
  }
  mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (err) console.error(err);
    else console.log("🚀 Successfully Connected to Mongoose!");
  });
}
