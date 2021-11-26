const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createLocation = {
    body: {
        city: Joi.object().keys({
            id: Joi.number().required(),
            name: Joi.string().required(),
        }),
        district: Joi.object().keys({
            id: Joi.number().required(),
            name: Joi.string().required(),
        }),
        ward: Joi.object().keys({
            id: Joi.number().required(),
            name: Joi.string().required(),
        }),
    },
};

const getCities = {
    body: Joi.object().keys({
        name: Joi.string(),
    }),
};

const getDistricts = {
    params: Joi.object().keys({
        cityId: Joi.custom(objectId).required(),
    }),
};

const getWards = {
    params: Joi.object().keys({
        cityId: Joi.custom(objectId).required(),
        districtId: Joi.custom(objectId).required(),
    }),
};

module.exports = {
    createLocation,
    getCities,
    getDistricts,
    getWards,
};
