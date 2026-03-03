import mongoose from "mongoose"

const connectDB= async() => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        console.log(`\n MongoDB connected !! DB Host ${connectInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection failed",error)
        process.exit(1)
    }
}

export default connectDB