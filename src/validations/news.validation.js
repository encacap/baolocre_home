const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createNews = {
    body: {
        title: Joi.string().required(),
        category: Joi.string().required(),
        content: Joi.string().required(),
        source: Joi.string().allow(""),
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
    },
};

const getSomeNews = {
    query: {
        page: Joi.number().allow(""),
        limit: Joi.number().allow(""),
        sortBy: Joi.string().allow(""),
    },
};

const getNews = {
    params: {
        id: Joi.custom(objectId).required(),
    },
};

module.exports = {
    createNews,
    getSomeNews,
    getNews,
};
