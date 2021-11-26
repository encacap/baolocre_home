const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");

const locationValidation = require("../../validations/location.validation");
const locationController = require("../../controllers/location.controller");

const router = express.Router();

router
    .route("/:cityId/:districtId/wards")
    .get(auth("getLocations"), validate(locationValidation.getWards), locationController.getWards);
router
    .route("/:cityId/districts")
    .get(auth("getLocations"), validate(locationValidation.getDistricts), locationController.getDistricts);
router.route("/cities").get(auth("getLocations"), validate(locationValidation.getCities), locationController.getCities);

router
    .route("/")
    .post(auth("manageLocations"), validate(locationValidation.createLocation), locationController.createLocation);

module.exports = router;
