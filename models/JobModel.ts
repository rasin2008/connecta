import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJob extends Document {
  jobId: number;
  title: string;
  company: string;
  description: string;
  category: string;
  location: string;
  pay: string;
  duration: string;
  postedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    jobId: {
      type: Number,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    pay: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    postedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job: Model<IJob> =
  mongoose.models.Job ||
  mongoose.model<IJob>("Job", JobSchema);

export default Job;