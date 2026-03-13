import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISetting extends Document {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  appearance: {
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor: string;
  };
}

const SettingSchema = new Schema<ISetting>(
  {
    siteName: { type: String, required: true, default: 'NewsSphere' },
    siteDescription: { type: String, default: 'Breaking News, Analysis & Global Insights' },
    siteUrl: { type: String, default: 'https://newssphere.com' },
    contactEmail: { type: String, default: 'contact@newssphere.com' },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String,
    },
    seo: {
      metaTitle: { type: String, default: 'NewsSphere - Global News' },
      metaDescription: { type: String, default: 'Stay updated with the latest news' },
      keywords: [String],
    },
    appearance: {
      logoUrl: String,
      faviconUrl: String,
      primaryColor: { type: String, default: '#ef4444' },
    },
  },
  { timestamps: true }
);

const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

export default Setting;
