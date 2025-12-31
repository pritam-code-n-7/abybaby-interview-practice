import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import UserRoutes from "./routes/user.route.js"
dotenv.config();

// express instance
const app = express();


// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin:"*",
    credentials: true,
}))
app.use(cookieParser())

// api routes
app.use('/api/v1', UserRoutes)

const port = process.env.PORT || 3000;

// listning to the port and host
app.listen(port, ()=>console.log(`app running on http://localhost:${port}`))





