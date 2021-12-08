const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createEstate = {
    body: {
        estate_id: Joi.string().allow(""),
        city: Joi.custom(objectId).required(),
        district: Joi.custom(objectId).required(),
        ward: Joi.custom(objectId).required(),
        street: Joi.string().allow(""),
        title: Joi.string().required(),
        price: Joi.string().required(),
        area: Joi.number().required(),
        category: Joi.string().required(),
        living_room: Joi.number().allow(""),
        bedroom: Joi.number().allow(""),
        bathroom: Joi.number().allow(""),
        page: Joi.number().allow(""),
        plot: Joi.number().allow(""),
        direction: Joi.string().allow(""),
        contact_name: Joi.string().required(),
        contact_phone: Joi.string().required(),
        description: Joi.string().allow(""),
        youtube: Joi.string().allow(""),
        avatar: Joi.object().keys({
            origin: Joi.string(),
            type: Joi.string(),
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
                type: Joi.string(),
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

module.exports = {
    createEstate,
};
