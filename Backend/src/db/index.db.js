import mongoose from "mongoose";

const DB_NAME = "zoom";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB Connected! DB Host: ", connectionInstance.connection.host);
    } catch (error) {
        console.log("Connecting Error ", error);
        process.exit(1);
    }

}

export default connectDB;
