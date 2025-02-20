import Restaurant from "../models/Restaurant.js";
import {
    buildQuery,
    getRestaurantsByPriceRange,
    getSortOptions,
} from "../utils/restaurantFilters.js";

export const getRestaurants = async (req, res) => {
    try {
        const { name, categories, rating, priceFrom, priceTo, sortBy } =
            req.query;
        const query = buildQuery({ name, categories, rating });
        const sortOptions = getSortOptions(sortBy);

        let restaurantIds = null;

        if (priceFrom || priceTo) {
            restaurantIds = await getRestaurantsByPriceRange(
                priceFrom,
                priceTo
            );
            query.id = { $in: restaurantIds };
        }

        const restaurants = await Restaurant.find(query).sort(sortOptions);

        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurants", error });
    }
};

export const getRestaurantById = async (req, res) => {
    const { restaurantId } = req.params;
    try {
        const restaurant = await Restaurant.findOne({
            id: restaurantId,
        }).populate("foodItems");

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found." });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurant", error });
    }
};
