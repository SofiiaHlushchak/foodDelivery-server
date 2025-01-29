import FoodItem from "../models/FoodItem.js";

export const getFoodItems = async (req, res) => {
    try {
        const foodItems = await FoodItem.find();
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching food items", error });
    }
};
