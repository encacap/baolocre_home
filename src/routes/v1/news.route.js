const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");

const newsValidation = require("../../validations/news.validation");
const newsController = require("../../controllers/news.controller");

const router = express.Router();

router
    .route("/:id")
    .get(auth("getNews"), validate(newsValidation.getNews), newsController.getNews)
    .patch(auth("manageNews"), validate(newsValidation.updateNews), newsController.updateNews)
    .delete(auth("manageNews"), validate(newsValidation.deleteNews), newsController.deleteNews);

router
    .route("/")
    .get(auth("getNews"), validate(newsValidation.getSomeNews), newsController.getSomeNews)
    .post(auth("manageNews"), validate(newsValidation.createNews), newsController.createNews);

module.exports = router;
