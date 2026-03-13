import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  bio?: string;
  role: 'user' | 'author' | 'admin';
  isVerified: boolean;
  isBanned: boolean;
  savedArticles: mongoose.Types.ObjectId[];
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    image: { type: String },
    bio: { type: String, maxlength: 300 },
    role: { type: String, enum: ['user', 'author', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    savedArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    emailVerified: { type: Date },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
