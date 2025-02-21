import { getNovaPostDepartments } from "../utils/novaPoshtaHelper.js";

export const getWarehouses = async (req, res) => {
    const cityName = req.query.cityName;

    if (!cityName) {
        return res.status(400).send("City name is required");
    }

    try {
        const departments = await getNovaPostDepartments(cityName);
        if (departments?.length) {
            const formattedDepartments = departments.map((department) => ({
                description: department.Description,
                cityDescription: department.CityDescription,
                settlementRegionDescription:
                    department.SettlementRegionsDescription,
                settlementAreaDescription: department.SettlementAreaDescription,
            }));

            res.json(formattedDepartments);
        } else {
            res.status(404).send("No departments found for the given city");
        }
    } catch (error) {
        res.status(500).send("Error fetching Nova Post departments");
    }
};
