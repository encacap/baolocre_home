// const httpStatus = require("http-status");
// const ThrowError = require("../utils/ThrowError");
const { City, District, Ward } = require("../models");

const createLocation = async (cityBody, districtBody, wardBody) => {
    let [city, district, ward] = await Promise.all([
        City.findOne({ cityId: cityBody.id }),
        District.findOne({ districtId: districtBody.id }),
        Ward.findOne({ wardId: wardBody.id }),
    ]);

    if (!city) {
        const { name, id, slug } = cityBody;
        city = await City.create({ cityId: id, name, slug });
    }

    if (!district) {
        const { name, id, slug } = districtBody;
        district = await District.create({ districtId: id, name, slug, cityId: city._id });
    }

    if (!ward) {
        const { name, id, slug } = wardBody;
        ward = await Ward.create({ wardId: id, name, slug, districtId: district._id });
    }

    return Promise.all([city.save(), district.save(), ward.save()]);
};

const getCities = async () => {
    const cities = await City.find({});
    return cities;
};

const getDistrictsByCityId = async (cityId) => {
    const districts = await District.find({ cityId });
    return districts;
};

const getWardsByDistrictId = async (districtId) => {
    const wards = await Ward.find({ districtId });
    return wards;
};

module.exports = {
    createLocation,
    getCities,
    getDistrictsByCityId,
    getWardsByDistrictId,
};
