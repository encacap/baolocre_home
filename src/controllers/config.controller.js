// const httpStatus = require("http-status");
// const ThrowError = require("../utils/ThrowError");
const catchAsync = require("../utils/catchAsync");
// const pick = require("../utils/pick");
const { configService } = require("../services");

const getConfigs = catchAsync(async (req, res) => {
    const { names } = req.query;
    const configs = await configService.getConfigs(names.split(","));
    res.send(configs);
});

const setConfigs = catchAsync(async (req, res) => {
    const { configs } = req.body;
    const updatedConfigs = await configService.setConfigs(configs);
    res.send(updatedConfigs);
});

module.exports = {
    setConfigs,
    getConfigs,
};
