// const httpStatus = require("http-status");
// const ThrowError = require("../utils/ThrowError");
const catchAsync = require("../utils/catchAsync");
const { imageService } = require("../services");

const createSignature = catchAsync(async (req, res) => {
    const { type } = req.query;
    const signature = imageService.createSignature(type);
    res.send(signature);
});

const deleteImages = catchAsync(async (req, res) => {
    const { images } = req.body;
    if (images.length > 0) {
        await imageService.deleteImages(images);
    }
    res.sendStatus(204);
});

module.exports = {
    createSignature,
    deleteImages,
};
