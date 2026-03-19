import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUsedKeyword extends Document {
  keyword: string;
  slug: string;
  status: 'success' | 'failed';
  postId?: mongoose.Types.ObjectId;
  usedAt: Date;
}

const UsedKeywordSchema = new Schema<IUsedKeyword>(
  {
    keyword: { type: String, required: true, lowercase: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    postId: { type: Schema.Types.ObjectId, ref: 'Article' },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UsedKeywordSchema.index({ keyword: 1 }, { unique: true });
UsedKeywordSchema.index({ slug: 1 }, { unique: true });

const UsedKeyword: Model<IUsedKeyword> =
  mongoose.models.UsedKeyword || mongoose.model<IUsedKeyword>('UsedKeyword', UsedKeywordSchema);

export default UsedKeyword;
