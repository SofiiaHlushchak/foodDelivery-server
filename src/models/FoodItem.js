import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    feedbacks: { type: Number, required: true },
    ingredients: [String],
    addons: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            countable: { type: Boolean, required: true },
        },
    ],
    imgUrl: { type: String, required: true },
    restaurantId: { type: String, ref: "Restaurant", required: true },
});

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

export default FoodItem;
