import User from "../models/User.js";
import {
    validateEmail,
    validatePassword,
} from "../validators/userValidator.js";
import { hashPassword, issueAccessToken } from "../utils/helper.js";

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
