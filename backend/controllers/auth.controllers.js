import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

            // Check if user already exists
            const existEmail = await User.findOne({ email });
            if(existEmail){
                return res.status(400).json({ message: "Email already exists!" });
            }
            if(password.length < 6){
                return res.status(400).json({ message: "Password must be at least 6 characters long!" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({name,email,password: hashedPassword});

            await user.save();
            const token = genToken(user._id);
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                sameSite: "strict", // Set to "none" if using cross-site cookies in production
                secure:false, // Set to true in production with HTTPS
            });
            return  res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: `Error signing up: ${error.message}` });
    }
}

export const signIn = async (req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "Invalid email or password!" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid email or password!" });
        }
        const token = genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: "strict", // Set to "none" if using cross-site cookies in production
            secure:false, // Set to true in production with HTTPS
        });
        res.status(200).json({ message: "Signed in successfully", token });
    } catch (error) {
        res.status(500).json({ message: `Error signing in: ${error.message}` });
    }
}

export const logout = (req,res)=>{
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: `Error logging out: ${error.message}` });
    }
}