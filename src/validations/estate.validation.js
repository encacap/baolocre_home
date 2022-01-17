const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createEstate = {
    body: {
        estate_id: Joi.string().allow(""),
        city: Joi.custom(objectId).allow(""),
        district: Joi.custom(objectId).allow(""),
        ward: Joi.custom(objectId).allow(""),
        street: Joi.string().allow(""),
        title: Joi.string().allow(""),
        price: Joi.string().allow(""),
        area: Joi.number().allow(""),
        category: Joi.string().allow(""),
        isPublished: Joi.boolean().allow(""),
        living_room: Joi.number().allow(""),
        bedroom: Joi.number().allow(""),
        bathroom: Joi.number().allow(""),
        page: Joi.number().allow(""),
        plot: Joi.number().allow(""),
        direction: Joi.string().allow(""),
        contact_name: Joi.string().allow(""),
        contact_phone: Joi.string().allow(""),
        description: Joi.string().allow(""),
        youtube: Joi.string().allow(""),
        avatar: Joi.object().keys({
            origin: Joi.string(),
            resourceType: Joi.string(),
            cloudName: Joi.string(),
            action: Joi.string(),
            version: Joi.number(),
            name: Joi.string(),
            publicId: Joi.string(),
            format: Joi.string(),
        }),
        pictures: Joi.array().items(
            Joi.object().keys({
                origin: Joi.string(),
                resourceType: Joi.string(),
                cloudName: Joi.string(),
                action: Joi.string(),
                version: Joi.number(),
                name: Joi.string(),
                publicId: Joi.string(),
                format: Joi.string(),
            })
        ),
        name: Joi.string(),
    },
};

const getEstates = {
    query: {
        page: Joi.number().allow(""),
        limit: Joi.number().allow(""),
        customId: Joi.string().allow(""),
        sortBy: Joi.string().allow(""),
        isPublished: Joi.boolean().default(true),
    },
};

const getEstate = {
    params: {
        id: Joi.string().required(),
    },
};

const updateEstate = {};

const deleteEstate = {
    params: {
        id: Joi.string().custom(objectId).required(),
    },
};

module.exports = {
    createEstate,
    getEstates,
    getEstate,
    updateEstate,
    deleteEstate,
};
