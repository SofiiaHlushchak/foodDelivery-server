import User from "../models/User.js";
import {
    validateEmail,
    validatePassword,
} from "../validators/userValidator.js";
import {
    hashPassword,
    issueAccessToken,
    comparePassword,
} from "../utils/helper.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({
            message:
                "Password must be at least 6 characters long, include an uppercase letter, a digit, and a special character",
        });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await hashPassword(password);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = issueAccessToken({ email: user.email, userId: user._id });

        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = issueAccessToken({ email: user.email, userId: user._id });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const googleLoginUser = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            const hashedPassword = await hashPassword("defaultPassword1$");

            user = new User({ email, name, password: hashedPassword });
            await user.save();
        }

        const authToken = issueAccessToken({
            email: user.email,
            userId: user._id,
        });

        res.status(200).json({ token: authToken });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid Google token" });
    }
};

export const facebookLoginUser = async (req, res) => {
    const { token } = req.body;

    try {
        const response = await axios.get(
            `https://graph.facebook.com/me?access_token=${token}&fields=id,email,name`
        );

        const { email, name } = response.data;

        let user = await User.findOne({ email });

        if (!user) {
            const hashedPassword = await hashPassword("defaultPassword1$");

            user = new User({ email, name, password: hashedPassword });
            await user.save();
        }

        const authToken = issueAccessToken({
            email: user.email,
            userId: user._id,
        });

        res.status(200).json({ token: authToken });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid Facebook token" });
    }
};

export const getLoggedUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.userId;

        const updatedFields = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedFields,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
