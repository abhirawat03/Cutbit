import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
const userSchema = new Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:false,
        // select: false,
    },
    avatar:{
        type:String,//cloudinary url
        // required:true,
        default:null,
    },
    googleId:{
        type:String,
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    refreshToken:{
        type:String
    },
    passwordChangedAt: {
        type:Date
    },
    resetPasswordToken: {
        type:String
    },
    resetPasswordExpiry: {
        type:Date
    },
},{timestamps:true})

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullName:this.fullName,
            avatar:this.avatar
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)