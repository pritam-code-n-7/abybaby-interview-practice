import { db } from "../config/db.js";
import bcrypt from "bcryptjs";

export const signupController = async(req, res)=>{
    try {
        // check user if exists
        const q = "SELECT * FROM users WHERE email = ?"

          db.query(q, [req.body.email], (error, data)=>{
            if(error) res.status(500).json(error);
            if(data.length) res.status(409).json({success: false, message:"User already exists, you can login"});

            // CREATE A NEW USER
                // hash the password
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(req.body.password, salt)

            const q = "INSERT INTO users (`name`, `email`, `password`) VALUE (?)";

            const values = [req.body.name, req.body.email, hashedPassword]

             db.query(q, [values], (error, data)=>{
                if(error) res.status(500).json(error);
                console.log(data);
                return res.status(201).json({success: true, message: "User created successfully"})
            })
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal server error"});
        
    }
}