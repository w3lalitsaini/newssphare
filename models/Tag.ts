import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITag extends Document {
  name: string;
  slug: string;
  createdAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true }
);

const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);

export default Tag;
