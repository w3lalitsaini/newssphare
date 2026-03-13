import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, lowercase: true },
    code: { type: String, required: true },
    expiresAt: { 
      type: Date, 
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    },
  },
  { timestamps: true }
);

// Auto-delete expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
OtpSchema.index({ email: 1, code: 1 });

const Otp: Model<IOtp> =
  mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);

export default Otp;
