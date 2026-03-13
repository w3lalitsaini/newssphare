import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdvertisement extends Document {
  title: string;
  type: 'image' | 'code' | 'google-adsense';
  placement: string;
  provider?: string;
  code?: string;
  image?: string;
  link?: string;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdvertisementSchema = new Schema<IAdvertisement>(
  {
    title: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['image', 'code', 'google-adsense'], 
      default: 'image' 
    },
    placement: {
      type: String,
      required: true,
    },
    provider: { type: String },
    code: { type: String },
    image: { type: String },
    link: { type: String },
    active: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const Advertisement: Model<IAdvertisement> =
  mongoose.models.Advertisement ||
  mongoose.model<IAdvertisement>('Advertisement', AdvertisementSchema);

export default Advertisement;
