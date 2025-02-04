import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        categories: [String],
        delivery: {
            cost: Number,
            time: Number,
        },
        feedbacks: Number,
        imgUrl: String,
        logoUrl: String,
        isFavourite: Boolean,
        rating: Number,
        verified: Boolean,
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

restaurantSchema.virtual("foodItems", {
    ref: "FoodItem",
    localField: "id",
    foreignField: "restaurantId",
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
