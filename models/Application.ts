import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  userId: string;
  jobId: number;
  title: string;
  company: string;
  location: string;
  pay: string;
  duration: string;
  status: "Applied" | "Under Review" | "Accepted";
  createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: String,
      required: true,
    },

    jobId: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    pay: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Under Review", "Accepted"],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;