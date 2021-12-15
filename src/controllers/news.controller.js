// const httpStatus = require("http-status");
// const ThrowError = require("../utils/ThrowError");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { newsService } = require("../services");

const createNews = catchAsync(async (req, res) => {
    const newsBody = pick(req.body, ["title", "content", "avatar", "pictures", "source", "category"]);
    const category = newsService.getCategoryBySlug(newsBody.category);
    const news = await newsService.createNews({ ...newsBody, category });
    res.status(201).json(news);
});

module.exports = {
    createNews,
};
