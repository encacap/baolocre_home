const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");

const estateValidation = require("../../validations/estate.validation");
const estateController = require("../../controllers/estate.controller");

const router = express.Router();

router
    .route("/:id")
    .patch(auth("manageEstates"), validate(estateValidation.updateEstate), estateController.updateEstate);

router
    .route("/")
    .post(auth("manageEstates"), validate(estateValidation.createEstate), estateController.createEstate)
    .get(auth("manageEstates"), validate(estateValidation.getEstates), estateController.getEstates);

module.exports = router;
