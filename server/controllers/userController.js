import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"
import { getSupportedLanguages } from "../lib/translator.js";

// Signup a new user
export const signup = async (req, res)=>{
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details" })
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({success: true, userData: newUser, token, message: "Account created successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Controller to login a user
export const login = async (req, res) =>{
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({email})

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect){
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id)

        res.json({success: true, userData, token, message: "Login successful"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
// Controller to check if user is authenticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}

// Controller to update user profile details
export const updateProfile = async (req, res)=>{
    try {
        const { profilePic, bio, fullName, preferredLanguage } = req.body;

        const userId = req.user._id;
        let updatedUser;

        // Build update object
        const updateFields = {};
        if (bio !== undefined) updateFields.bio = bio;
        if (fullName !== undefined) updateFields.fullName = fullName;
        if (preferredLanguage !== undefined) updateFields.preferredLanguage = preferredLanguage;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, updateFields, {new: true});
        } else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updateFields.profilePic = upload.secure_url;
            updatedUser = await User.findByIdAndUpdate(userId, updateFields, {new: true});
        }
        res.json({success: true, user: updatedUser})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Controller to get supported languages for translation
export const getSupportedLanguagesController = async (req, res) => {
    try {
        const languages = await getSupportedLanguages();
        res.json({success: true, languages});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}