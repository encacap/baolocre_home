const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createNews = {
    body: {
        title: Joi.string().allow(""),
        category: Joi.string().allow(""),
        content: Joi.string().allow(""),
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
        isPublished: Joi.boolean().default(true),
    },
};

const getSomeNews = {
    query: {
        page: Joi.number().allow(""),
        limit: Joi.number().allow(""),
        sortBy: Joi.string().allow(""),
        title: Joi.string().allow(""),
        isPublished: Joi.boolean().allow(""),
    },
};

const getNews = {
    params: {
        id: Joi.custom(objectId).required(),
    },
};

const updateNews = {
    params: {
        id: Joi.custom(objectId).required(),
    },
    body: {
        ...createNews.body,
        priority: Joi.number().allow(""),
    },
};

const deleteNews = {
    params: {
        id: Joi.custom(objectId).required(),
    },
};

module.exports = {
    createNews,
    getSomeNews,
    getNews,
    updateNews,
    deleteNews,
};
