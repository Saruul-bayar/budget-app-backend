import mongoose, { Document, Schema } from "mongoose";

export interface IOrlogo extends Document {
  orlogo: Int32Array;
  date: Date;
  detail: string;
}

const orlogoSchema = new Schema({
  orlogo: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
export const Orlogo = mongoose.model<IOrlogo>("Orlogo", orlogoSchema);
