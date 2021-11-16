const express = require("express");
const renderHTML = require("../middlewares/renderHTML");
const siteController = require("../controllers/site.controller");

const router = express.Router();

router.get(
    "/bat-dong-san-ban/:category/:city/:district/:ward/:id/:slug",
    siteController.renderRealEstatePage
);
router.get("/bat-dong-san-ban", siteController.renderRealEstatesPage);

router.get("/tin-tuc/:category/:id/:slug", siteController.renderNewsDetailPage);
router.get("/tin-tuc", siteController.renderNewsPage);

router.get("/", siteController.renderHomePage);

router.use(renderHTML);

module.exports = router;
