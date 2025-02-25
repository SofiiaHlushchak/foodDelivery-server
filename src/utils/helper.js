import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
}

export async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

export function issueAccessToken(payload) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing from environment variables");
    }

    return jwt.sign(payload, process.env.JWT_SECRET);
}
