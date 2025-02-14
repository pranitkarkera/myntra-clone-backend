require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/users.models");

const mongoURI = process.env.MONGODB;

async function dropIndexes() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Drop all indexes for the users collection
    await User.collection.dropIndexes();

    console.log("Indexes dropped successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error dropping indexes:", error);
    mongoose.disconnect();
  }
}

dropIndexes();
