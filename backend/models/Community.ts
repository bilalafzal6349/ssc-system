// ```file
// models/Community.ts
import mongoose, { Schema, model, Document } from "mongoose";

interface ICommunity extends Document {
  name: string;
  type: "public" | "private";
  members: mongoose.Types.ObjectId[];
  joinRequests: {
    userId: mongoose.Types.ObjectId;
    credentials: {
      preTrust: number;
      legalAgreements: number;
      communityType: number;
      capabilities: number;
    };
  }[];
}

const CommunitySchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["public", "private"], required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  joinRequests: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      credentials: {
        preTrust: Number,
        legalAgreements: Number,
        communityType: Number,
        capabilities: Number,
      },
    },
  ],
});

export default mongoose.models.Community ||
  model<ICommunity>("Community", CommunitySchema);
