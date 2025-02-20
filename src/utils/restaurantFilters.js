import FoodItem from "../models/FoodItem.js";

export const buildQuery = ({ name, categories, rating }) => {
    let query = {};

    if (name) {
        query.name = { $regex: name, $options: "i" };
    }

    if (categories) {
        query.categories = { $in: categories.split(",") };
    }

    if (rating) {
        query.rating = { $gte: Number(rating) };
    }

    return query;
};

export const getRestaurantsByPriceRange = async (priceFrom, priceTo) => {
    let priceQuery = {};

    if (priceFrom) priceQuery.$gte = Number(priceFrom);
    if (priceTo) priceQuery.$lte = Number(priceTo);

    const foodItems = await FoodItem.find(
        { price: priceQuery },
        "restaurantId"
    );

    return [...new Set(foodItems.map((item) => item.restaurantId))];
};

export const getSortOptions = (sortBy) => {
    const sortMap = {
        feedbacks: { feedbacks: -1 },
        quickest_delivery: { "delivery.time": 1 },
        cost_low_to_high: { "delivery.cost": 1 },
        cost_high_to_low: { "delivery.cost": -1 },
    };

    return sortMap[sortBy] || {};
};
