import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupController = (req, res)=>{
    try {
        // check user if exists
        const q = "SELECT * FROM users WHERE email = ?"

          db.query(q, [req.body.email], (error, data)=>{
            if(error) return res.status(500).json(error);
            if(data.length) return res.status(409).json({success: false, message:"User already exists, you can login"});

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

export const loginController = (req, res)=>{
    try {
        // CHECK USER IF DOESN'T EXISTS
        const q = "SELECT * FROM users WHERE email = ?";
        db.query(q, req.body.email, (error, data)=>{
            if(error) return res.status(500).json(error);
            if(!data.length) return res.status(404).json({success: false, message:"User with this email not found, please register"});

            // AUTHENTICATE USER
                // match password
                const matchedPassword = bcrypt.compare(req.body.password, data[0].password)
                if(!matchedPassword) return res.status(400).json({success: false, message:"Invalid credentials"})
                // create JWT token
                const token = jwt.sign(
                    {id:data[0].id, name:data[0].name, email:data[0].email, password: matchedPassword},
                    process.env.JWT_SECRET, 
                    {expiresIn: "10d"},
                );

                const {password, ...others} = data[0];

                return res.cookie("accessToken", token, {
                    httpOnly: true,
                    path: "/",
                    maxAge: 10 * 24 * 60 * 60 * 1000,
                }).status(200).json(others);

        })

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const logoutController = (_req, res)=>{
    try {
        return res.clearCookie("accessToken", {
            secure: true,
            sameSite: "none"
        }).status(200).json({success: true, message:"User has been logged out"})
        
    } catch (error) {
         console.error(error);
        return res.status(500).json({success: false, message: "Internal server error"});
        
    }
}
