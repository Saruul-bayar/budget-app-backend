import mongoose from "mongoose";

export async function connectToDB(): Promise<void> {
  if (!process.env.DB_CONNECTION) {
    console.error("DB_CONNECTION environment variable was not set");
    process.exit(1);
  }
  mongoose.connect(process.env.DB_CONNECTION, (err) => {
    if (err) console.error(err);
    else console.log("🚀 Successfully Connected to Mongoose!");
  });
}
