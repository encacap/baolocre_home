// const httpStatus = require("http-status");
// const ThrowError = require("../utils/ThrowError");
const catchAsync = require("../utils/catchAsync");
const { convertStringToSlug } = require("../utils/helpers");
const { locationService } = require("../services");

const createLocation = catchAsync(async (req, res) => {
    const { city, district, ward } = req.body;
    city.slug = convertStringToSlug(city.name);
    district.slug = convertStringToSlug(district.name);
    ward.slug = convertStringToSlug(ward.name);
    const newLocation = await locationService.createLocation(city, district, ward);
    res.json(newLocation);
});

const getCities = catchAsync(async (req, res) => {
    const cities = await locationService.getCities();
    res.json(cities);
});

const getDistricts = catchAsync(async (req, res) => {
    const { cityId } = req.params;
    const districts = await locationService.getDistrictsByCityId(cityId);
    res.json(districts);
});

const getWards = catchAsync(async (req, res) => {
    const { districtId } = req.params;
    const wards = await locationService.getWardsByDistrictId(districtId);
    res.json(wards);
});

module.exports = {
    createLocation,
    getCities,
    getDistricts,
    getWards,
};
