import express from "express"
import cors from "cors"
import dotenv from "dotenv"
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

// get request for testing purpose
app.get('/',(_req, res)=>{
    try {
        return res.status(200).json({success: true, message:"Hello World!"})
        
    } catch (error) {
        console.error(error)
        
    }
})

const port = process.env.PORT || 3000;

// listning to the port and host
app.listen(port, ()=>console.log(`app running on http://localhost:${port}`))

