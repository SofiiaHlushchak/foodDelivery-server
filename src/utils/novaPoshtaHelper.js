import axios from "axios";

export const getNovaPostDepartments = async (cityName) => {
    const apiKey = process.env.NOVA_POSHTA_API_KEY;
    const url = "https://api.novaposhta.ua/v2.0/json/";

    const body = {
        apiKey: apiKey,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
            CityName: cityName,
        },
    };

    try {
        const response = await axios.post(url, body);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching Nova Post departments", error);
    }
};
