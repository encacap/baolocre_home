const express = require("express");
const apiRoutes = require("./v1");
const homeRoutes = require("./site.route");
const config = require("../config/config");

const router = express.Router();

const defaultRoutes = [
    {
        path: "/api/v1",
        route: apiRoutes,
    },
    {
        path: "/",
        route: homeRoutes,
    },
];

const devRoutes = [
    // routes available only in development mode
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}

module.exports = router;
