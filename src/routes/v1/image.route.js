const express = require("express");
const auth = require("../../middlewares/auth");
// const validate = require("../../middlewares/validate");

// const imageValidation = require("../../validations/image.validation");
const imageController = require("../../controllers/image.controller");

const router = express.Router();

router.route("/signature").get(auth("manageImages"), imageController.createSignature);
router.route("/delete").post(auth("manageImages"), imageController.deleteImages);

module.exports = router;
