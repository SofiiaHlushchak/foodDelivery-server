import FoodItem from "../models/FoodItem.js";

export const getFoodItems = async (req, res) => {
    try {
        const foodItems = await FoodItem.find();
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching food items", error });
    }
};

export const getFoodItemById = async (req, res) => {
    const { foodItemId } = req.params;
    try {
        const foodItem = await FoodItem.findById(foodItemId);

        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found." });
        }

        res.status(200).json(foodItem);
    } catch (error) {
        res.status(500).json({ message: "Error fetching food item", error });
    }
};
