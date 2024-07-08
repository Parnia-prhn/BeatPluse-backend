import mongoose, { Connection } from "mongoose";

async function connectToDatabase(): Promise<Connection> {
  try {
    const connection = await mongoose.connect(
      "mongodb://localhost:27017/beatPlus"
    );

    console.log("Connected to MongoDB");
    return connection.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default connectToDatabase;
