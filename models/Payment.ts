import mongoose, { Schema, models } from "mongoose";

const PaymentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    jobId: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    method: {
      type: String,
      enum: ["UPI", "Card", "Net Banking"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Payment =
  models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;