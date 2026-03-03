import mongoose, { Schema } from "mongoose";

const anayticsSchema = new Schema({
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url",
        required:true,
        index: true,
    },
    date:{
        type:Date,
        required:true,
        index:true
    },
    clicks:{
        type:Number,
        default:0,
    },
    uniqueVisitors:{
        type:Number,
        default:0,
    },
    deviceBreakdown: {
        mobile: { type: Number, default: 0 },
        desktop: { type: Number, default: 0 },
        tablet: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
    },

    countryBreakdown: {
        type: Map,
        of: Number,
        default: {},
    },

},{timestamps:true});

anayticsSchema.index(
    {urlId:1, date:1},
    {unique:true}
);

export const Analytics = mongoose.model("Analytics", anayticsSchema);
