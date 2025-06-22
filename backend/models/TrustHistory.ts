// ```file
// models/TrustHistory.ts
import mongoose, { Schema, model, Document } from "mongoose";

interface ITrustHistory extends Document {
  user: mongoose.Types.ObjectId;
  score: number;
  reason: string;
  createdAt: Date;
}

const TrustHistorySchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true },
  reason: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TrustHistory ||
  model<ITrustHistory>("TrustHistory", TrustHistorySchema);
