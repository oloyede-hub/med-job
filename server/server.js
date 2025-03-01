import express from "express";
import { auth }  from 'express-openid-connect';
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import connect from "./db/connect.js";
import fs from "fs"
dotenv.config();
import asyncHandler from "express-async-handler"
import User from "./models/UserModel.js";
const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET_KEY,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUERBASEURL,
  routes: {
    postLogoutRedirect: process.env.CLIENT_URL
  }
};

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser());
app.use(auth(config))


// function to check if the user exist in the db
const ensureUserInDB = asyncHandler( async(user) => {
    try {
        const existingUser = await User.findOne({auth0Id: user.sub});
        if(!existingUser) {
            const newUser = new User({ 
                auth0Id: user.sub,
                email: user.email,
                name: user.name,
                role: "jobseeker",
                profilePicture: user.picture,

            })
            await newUser.save();
            console.log("User added to the db", user)
        }else {
            console.log("User already existed", existingUser);
        }
    } catch (error) {
        console.log("Error checking or adding user to database", error.message)
    }
})

 app.get("/", async (req, res) => {
    if(req.oidc.isAuthenticated()) {
        // Check if Auth0 user exists in the db
        await ensureUserInDB(req.oidc.user)
        // redirect to the frontend
        return res.redirect(process.env.CLIENT_URL)
    }else {
        return res.send("Logged out");
    }
 })

// routes
const routeFiles = fs.readdirSync("./routes");

routeFiles.forEach(file => {
    import(`./routes/${file}`).then((route) => {
        app.use("/api/v1", route.default)
    }).catch((error) => {
        console.log("Error importing route", error.message);
    });
})



const server = async () => {
    try {
        await connect()
        app.listen(process.env.PORT, () => {
            console.log(`server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log(`Server error`, error.message)
        process.exit(1);
    }
}

server();