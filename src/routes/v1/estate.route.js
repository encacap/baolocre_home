const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");

const locationValidation = require("../../validations/estate.validation");
const locationController = require("../../controllers/estate.controller");

const router = express.Router();

// router
//     .route("/")
//     .post(auth("manageLocations"), validate(locationValidation.createLocation), locationController.createLocation);

module.exports = router;
