import mongoose from "mongoose";

export default async function connectToDB() {
  const mongo_url = process.env.MONGO_URL;
  
  if (!mongo_url) {
    throw new Error("Mongo db environment variable is undefined");
  }

  try {
    await mongoose.connect(mongo_url);
    console.log("Connected to Mongodb!");
  } catch (error) {
    console.log("Error connecting to MongoDb: ", error);
    throw error;
  }
}
