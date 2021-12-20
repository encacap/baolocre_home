const Joi = require("joi");
// const { objectId } = require("./custom.validation");

const getConfigs = {
    query: {
        names: Joi.string().required(),
    },
};

const setConfigs = {
    body: {
        configs: Joi.array().items({
            name: Joi.string().required(),
            value: Joi.string().allow(""),
        }),
    },
};

module.exports = {
    setConfigs,
    getConfigs,
};
