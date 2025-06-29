// ```file
// models/User.ts
import mongoose, { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  id: string;
  role: "user" | "admin" | "maintainer";
  trustScore: number;
  communities: mongoose.Types.ObjectId[];
  githubHandle?: string;
  contactInfo?: string;
  votes: { vote: string; reason: string; voter: string }[];
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["user", "admin", "maintainer"],
    default: "user",
  },
  trustScore: { type: Number, default: 0 },
  communities: [{ type: Schema.Types.ObjectId, ref: "Community" }],
  githubHandle: String,
  contactInfo: String,
  votes: [{ vote: String, reason: String, voter: String }],
});

UserSchema.index({ id: 1 });
UserSchema.index({ communities: 1 });

export default mongoose.models.User || model<IUser>("User", UserSchema);
