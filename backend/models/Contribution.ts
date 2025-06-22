// ```file
// models/Contribution.ts
import mongoose, { Schema, model, Document } from "mongoose";

interface IContribution extends Document {
  user: mongoose.Types.ObjectId;
  repository: string;
  mergeRequestId: string;
  status: "pending" | "approved" | "rejected";
  description: string;
  feedback: {
    quality: number;
    compliance: number;
    reason?: string;
  };
  flags: { reason: string; flaggedBy: string }[];
  createdAt: Date;
}

const ContributionSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  repository: String,
  mergeRequestId: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  description: String,
  feedback: {
    quality: Number,
    compliance: Number,
    reason: String,
  },
  flags: [{ reason: String, flaggedBy: String }],
  createdAt: { type: Date, default: Date.now },
});

ContributionSchema.index({ user: 1, status: 1 });

export default mongoose.models.Contribution ||
  model<IContribution>("Contribution", ContributionSchema);
