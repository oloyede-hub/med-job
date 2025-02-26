import mongoose from "mongoose";

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {})
        console.log("Connect to database")
    } catch (error) {
        console.log("failed to connect to database", error.message)
        process.exit(1);
    }
}

export default connect;