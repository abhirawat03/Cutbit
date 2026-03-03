import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
      index:true
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    totalUniqueVisitors: {   // lifetime only
      type: Number,
      default: 0,
    },
    //     type:Map,
    //     of:Number,
    //     default:{},
    // countryStats:{
    //     type:Map,
    //     of:Number,
    //     default:{},
    // },
    // deviceStats:{
    // },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active",
    },
  },
  { timestamps: true },
);

export const Url = mongoose.model("Url", urlSchema);
