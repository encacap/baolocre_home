const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");

const configValidation = require("../../validations/config.validation");
const configController = require("../../controllers/config.controller");

const router = express.Router();

// router
//     .route("/:cityId/:districtId/wards")
//     .get(auth("getLocations"), validate(configValidation.getWards), configController.getWards);
// router
//     .route("/:cityId/districts")
//     .get(auth("getLocations"), validate(configValidation.getDistricts), configController.getDistricts);
// router.route("/cities").get(auth("getLocations"), validate(configValidation.getCities), configController.getCities);

router
    .route("/")
    .get(auth("getConfigs"), validate(configValidation.getConfigs), configController.getConfigs)
    .post(auth("manageConfigs"), validate(configValidation.setConfigs), configController.setConfigs);

module.exports = router;
