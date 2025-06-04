import mongoose from 'mongoose';

const connect = async () =>{
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URI, {});
    } catch (error) {
        console.log("Failed to connect to Datebase", error.message);
        process.exit(1);
    }
}

export default connect;