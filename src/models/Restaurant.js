import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    categories: [String],
    delivery: {
        cost: Number,
        time: Number,
    },
    feedbacks: Number,
    imgUrl: String,
    isFavourite: Boolean,
    rating: Number,
    verified: Boolean,
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
