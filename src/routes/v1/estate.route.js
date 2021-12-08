const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");

const estateValidation = require("../../validations/estate.validation");
const estateController = require("../../controllers/estate.controller");

const router = express.Router();

router.route("/").post(auth("manageEstates"), validate(estateValidation.createEstate), estateController.createEstate);

module.exports = router;
