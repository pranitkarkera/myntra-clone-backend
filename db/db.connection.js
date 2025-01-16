require('dotenv').config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB;
const initializeDatabase = async () => {
    await mongoose
    .connect(mongoURI)
    .then(()=> {
        console.log("Connected with Database")
    })
    .catch((error) => console.log("Error connecting to database", error))
}

module.exports = { initializeDatabase }