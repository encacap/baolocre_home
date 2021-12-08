// const httpStatus = require("http-status");
// const ThrowError = require("../utils/ThrowError");
const catchAsync = require("../utils/catchAsync");
const { locationService, estateService } = require("../services");
const { getEstateProperties } = require("../utils/helpers");

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

module.exports = {
    createEstate,
};
