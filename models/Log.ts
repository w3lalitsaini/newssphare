import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILog extends Document {
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
  metadata: any;
  timestamp: Date;
}

const LogSchema = new Schema<ILog>(
  {
    level: { type: String, enum: ['info', 'warn', 'error', 'debug'], required: true },
    source: { type: String, required: true },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

LogSchema.index({ timestamp: -1 });
LogSchema.index({ level: 1 });

const Log: Model<ILog> =
  mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);

export default Log;
