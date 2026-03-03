import mongoose,{Schema} from "mongoose";

const visitorSchema = new Schema({
    urlId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Url",
        required:true,
        index:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true,
    },
    visitorId: {              // PRODUCTION IDENTITY
        type: String,
        required: true,
        index: true,
    },
    ipHash:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true,
        index:true
    },
    device: {
        type: String,
        enum: ["mobile", "desktop", "tablet", "other"],
        required: true,
    },

    country: {
        type: String,
        default: "Unknown",
    },

    referrer: {
        type: String,
    },
},{timestamps:true})

visitorSchema.index(
    {urlId:1, visitorId:1, date:1},
    {unique:true}
)

export const Visitor = mongoose.model("Visitor",visitorSchema)