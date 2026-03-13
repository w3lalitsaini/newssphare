import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdvertisement extends Document {
  name: string;
  placement: 'top-banner' | 'sidebar' | 'in-article' | 'between-cards' | 'footer';
  adCode: string;
  isActive: boolean;
  createdAt: Date;
}

const AdvertisementSchema = new Schema<IAdvertisement>(
  {
    name: { type: String, required: true },
    placement: {
      type: String,
      enum: ['top-banner', 'sidebar', 'in-article', 'between-cards', 'footer'],
      required: true,
    },
    adCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Advertisement: Model<IAdvertisement> =
  mongoose.models.Advertisement ||
  mongoose.model<IAdvertisement>('Advertisement', AdvertisementSchema);

export default Advertisement;
