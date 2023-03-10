import * as dotenv from "dotenv"
import db from "./config/database.js"
import express from "express"
import User from "./model/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import auth from "./middleware/auth.js"

dotenv.config()
db()

const app = express()

app.use(express.json())

app.post("/register", async (req, res) => {
    try {
        // get user input
        const { first_name, last_name, email, password } = req.body
        console.log(req.body)

        // validate input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required")
        }

        // check if the user already exists
        // validate if user exists in our db
        const oldUser = await User.findOne({ email })

        if (oldUser) {
            return res.status(409).send("User already exist. Please login")
        }
 
        // encrypt our password
        let encryptedPassword = await bcrypt.hash(password, 10)

        // create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        })

        // create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        )

        // save token
        user.token = token

        res.status(201).json(user)
    } catch (error) {
        console.log(error)
    }
})

app.post("/login", async (req, res) => {
    try {
        // get user input 
        const { email, password } = req.body

        // validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required")
        }

        // validate if user already exists
        const user = await User.findOne({ email })

        if (user && (bcrypt.compare(password, user.password))) {
            // create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                },
            )

            // save user token
            user.token = token

            res.status(200).json(user)
        }

        res.status(400).send("Invalid Creadntials")
    } catch (error) {
        console.log(error)
    }
})

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome")
})

export default app