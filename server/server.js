import express from 'express';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connect from './db/connect.js';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import User from './models/userModel.js';
dotenv.config();

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL:process.env.ISSUER_BASE_URL,
  session: {
    rolling: true,
    cookie: {
      secure: false,        // ❗ MUST be false for HTTP local dev
      httpOnly: true,
      
    }
  }
}

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(auth(config));

const ensureUserInDB = asyncHandler(async(user) =>{
    try {
        const existingUser = await User.findOne({auth0Id: user.sub});
        
        if(!existingUser){
            const newUser = await User.create({
                name: user.name,
                email: user.email,
                auth0Id: user.sub,
                profilePicture: user.picture,
                role:"jobSeeker",
                proffesion: user.proffesion
            });
        }else{
            console.log("User already exists in DB", existingUser);
        }
    } catch (error) {
        
    }
})


app.get('/', async(req,res) =>{
    if(req.oidc.isAuthenticated()){

        await ensureUserInDB(req.oidc.user);

        res.redirect(process.env.CLIENT_URL);
    }else{
        return res.send('Logged out');
    }
})


const routeFiles = fs.readdirSync("./routes");
// dynamic routes
routeFiles.forEach((file) => {
    import(`./routes/${file}`).then((route) => {
            app.use("/api/v1/",route.default)
    }).catch((error) => {
        console.log("Error loading route", error);
    });
});



const server = async () =>{
    try {
        await connect();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log("server error", error);
    }
}

server();