const httpStatus = require("http-status");
const ThrowError = require("../utils/ThrowError");
const Config = require("../models/config.model");

const getConfig = async (name, isThrow = true) => {
    const config = await Config.findOne({ name });
    if (!config && isThrow) {
        throw new ThrowError(httpStatus.NOT_FOUND, "Config not found");
    }
    return config;
};

const getConfigs = async (names) => {
    const configs = await Config.find({ name: { $in: names } });
    return configs;
};

const setConfig = async (name, value) => {
    let config = await getConfig(name, false);
    if (!config) {
        config = new Config({ name, value });
    } else {
        config.value = value;
    }
    return config.save();
};

const setConfigs = async (configs) => {
    const promises = configs.map((config) => setConfig(config.name, config.value));
    return Promise.all(promises);
};

module.exports = {
    setConfigs,
    getConfig,
    getConfigs,
};
