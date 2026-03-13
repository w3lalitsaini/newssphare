import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
  article: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'deleted';
  parentComment?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 1000 },
    status: { type: String, enum: ['pending', 'approved', 'spam', 'deleted'], default: 'pending' },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true }
);

CommentSchema.index({ article: 1, status: 1 });

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
