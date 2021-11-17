const data = require("../../estates.data.json");

const queryEstates = async (filters, options) => {
    const dataCopy = JSON.parse(JSON.stringify(data));
    const limit = options.limit || 10;
    return {
        results: dataCopy.slice(0, limit),
        page: 1,
        limit,
        totalResults: dataCopy.length,
        totalPages: 1,
    };
};

const getEstateById = async (id) => {
    const dataCopy = JSON.parse(JSON.stringify(data));
    return dataCopy.find((estate) => estate.id === String(id));
};

module.exports = {
    queryEstates,
    getEstateById,
};
