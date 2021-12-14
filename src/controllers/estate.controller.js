const httpStatus = require("http-status");
const ThrowError = require("../utils/ThrowError");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { locationService, estateService, imageService } = require("../services");
const { getEstateProperties, normalizeEstatesData, normalizeEstateData } = require("../utils/helpers");
const { isMongoObjectId } = require("../utils/validator");

const createEstate = catchAsync(async (req, res) => {
    const {
        category: categorySlug,
        estate_id: customId,
        city: cityId,
        district: districtId,
        ward: wardId,
        street,
        contact_name: contactName,
        contact_phone: contactPhone,
    } = req.body;
    const [city, district, ward] = await Promise.all([
        locationService.getCityById(cityId),
        locationService.getDistrictById(districtId),
        locationService.getWardById(wardId),
    ]);
    const category = estateService.getCategoryBySlug(categorySlug);
    const estateBody = {
        ...req.body,
        customId,
        category,
        properties: getEstateProperties(req.body),
        location: {
            city,
            district,
            ward,
            street,
        },
        contact: {
            name: contactName,
            phone: contactPhone,
        },
    };
    const estate = await estateService.createEstate(estateBody);
    res.status(201).json(estate);
});

const getEstates = catchAsync(async (req, res) => {
    const filters = pick(req.query, ["customId"]);
    const options = pick(req.query, ["limit", "page", "sortBy"]);
    if (filters.customId) {
        filters.customId = { $regex: filters.customId, $options: "i" };
    }
    const estates = await estateService.queryEstates(filters, options);
    res.json(normalizeEstatesData(estates));
});

const getEstate = catchAsync(async (req, res) => {
    const { id: estateId } = req.params;
    let estate;
    if (isMongoObjectId(estateId)) {
        estate = await estateService.getEstateById(estateId);
    } else {
        estate = await estateService.getEstateByCustomId(estateId);
    }
    if (!estate) {
        throw new ThrowError(httpStatus.NOT_FOUND, "Estate not found");
    }
    res.json(normalizeEstateData(estate));
});

const updateEstate = catchAsync(async (req, res) => {
    const estate = await estateService.updateEstateById(req.params.id, req.body);
    res.json(estate);
});

const deleteEstate = catchAsync(async (req, res) => {
    const { id: estateId } = req.params;
    const estate = await estateService.getEstateById(estateId);
    const estatePictures = [...estate.pictures, estate.avatar].filter((picture) => picture.resourceType === "image");
    await Promise.all([imageService.deleteImages(estatePictures), estateService.deleteEstate(estate)]);
    res.status(204).end();
});

module.exports = {
    createEstate,
    getEstates,
    getEstate,
    updateEstate,
    deleteEstate,
};
