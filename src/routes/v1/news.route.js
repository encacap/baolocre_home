const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");

const newsValidation = require("../../validations/news.validation");
const newsController = require("../../controllers/news.controller");

const router = express.Router();

// router
//     .route("/:id")
//     .get(auth("manageEstates"), validate(newsValidation.getEstate), newsController.getEstate)
//     .patch(auth("manageEstates"), validate(newsValidation.updateEstate), newsController.updateEstate)
//     .delete(auth("manageEstates"), validate(newsValidation.deleteEstate), newsController.deleteEstate);

// router
//     .route("/")
//     .post(auth("manageEstates"), validate(newsValidation.createEstate), newsController.createEstate)
//     .get(auth("manageEstates"), validate(newsValidation.getEstates), newsController.getEstates);

router.route("/").post(auth("manageNews"), validate(newsValidation.createNews), newsController.createNews);

module.exports = router;
