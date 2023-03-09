import mongoose from "mongoose";
import * as dotenv from 'dotenv' 
dotenv.config()

const MONGO_URI = process.env.MONGO_URI

export default () => {
    // connecting to the database
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Succesfully connected to db");
        })
        .catch((error) => {
            console.log("Database connection failed. Exiting now...");
            console.log(error);
            process.exit(1);
        });
};
