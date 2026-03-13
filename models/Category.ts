import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    color: { type: String, default: '#3B82F6' },
    icon: { type: String },
  },
  { timestamps: true }
);

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
