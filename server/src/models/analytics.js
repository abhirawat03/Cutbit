import mongoose, { Schema } from "mongoose";

const analyticsSchema = new Schema({
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url",
        required:true,
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
    deviceStats: {
        type: Map,
        of: Number,
        default: {},
    },

    countryStats: {
        type: Map,
        of: Number,
        default: {},
    },

},{timestamps:true});

analyticsSchema.index(
    {urlId:1, date:1},
    {unique:true}
);
analyticsSchema.index(
    { userId:1, date:1 }
);

export const Analytics = mongoose.model("Analytics", analyticsSchema);
