import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, "Name too short"],
            maxLength: [50, "Name too long"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        deliveryAddress: {
            region: { type: String },
            city: { type: String },
            street: { type: String },
        },
        novaPostDepartment: {
            type: String,
            required: false,
        },
        age: {
            type: Number,
            min: 16,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
