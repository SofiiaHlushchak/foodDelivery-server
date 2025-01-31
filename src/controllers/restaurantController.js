import Restaurant from "../models/Restaurant.js";

export const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurants", error });
    }
};

export const getRestaurantById = async (req, res) => {
    const { restaurantId } = req.params;
    try {
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found." });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurant", error });
    }
};
