import * as dotenv from "dotenv"
import db from "./config/database.js"
import express from "express"

dotenv.config()
db()

const app = express()

app.use(express.json())

export default app