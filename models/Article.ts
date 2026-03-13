import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isTrending: boolean;
  views: number;
  readingTime: number;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true, maxlength: 500 },
    content: { type: String, required: true },
    featuredImage: { type: String, required: true },
    featuredImageAlt: { type: String, default: '' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    readingTime: { type: Number, default: 1 },
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
    ogImage: { type: String },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ category: 1, status: 1 });
ArticleSchema.index({ isFeatured: 1 });
ArticleSchema.index({ isTrending: 1 });
ArticleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
