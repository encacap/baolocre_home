const httpStatus = require("http-status");
const ThrowError = require("../utils/ThrowError");
const { Estate } = require("../models");

const createEstate = async (estateBody) => {
    const estate = new Estate(estateBody);
    return estate.save();
};

const queryEstates = async (filters, options) => {
    const estates = await Estate.paginate(filters, options);
    return estates;
};

const getRandomEstates = async (filters, options) => {
    const estates = await Estate.aggregate([
        { $match: filters },
        {
            $sample: {
                size: options.limit,
            },
        },
    ]).exec();
    return { results: estates, totalResults: estates.length };
};

const getEstateById = async (estateId) => {
    const estate = await Estate.findById(estateId);
    return estate;
};

const getCategoryBySlug = (slug) => {
    const categories = {
        "nghi-duong": {
            name: "Nghỉ dưỡng",
            slug: "nghi-duong",
        },
        "dat-nen": {
            name: "Đất nền",
            slug: "dat-nen",
        },
        "nha-pho": {
            name: "Nhà phố",
            slug: "nha-pho",
        },
    };
    const category = categories[slug];
    if (!category) {
        throw new ThrowError(httpStatus.NOT_FOUND, "Category not found");
    }
    return category;
};

module.exports = {
    createEstate,
    queryEstates,
    getRandomEstates,
    getEstateById,
    getCategoryBySlug,
};
