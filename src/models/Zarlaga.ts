import mongoose, { Document, Schema } from "mongoose";

export interface IZarlaga extends Document {
  zarlaga: Int32Array;
  date: Date;
  detail: string;
}

const zarlagaSchema = new Schema({
  zarlaga: {
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
export const Zarlaga = mongoose.model<IZarlaga>("Zarlaga", zarlagaSchema);
