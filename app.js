import * as dotenv from "dotenv"
import db from "./config/database.js"
import express from "express"
import User from "./model/user.js"

dotenv.config()
db()

const app = express()

app.use(express.json())

app.post("/register", async (req, res) => {
    try {
        // get user input
        const {first_name, last_name, email, password} = req.body

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
        encryptedPassword = await bcrypt.hash(password, 10)

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

app.post("/login", (req, res) => {

})

export default app