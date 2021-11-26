const express = require("express");
const config = require("../../config/config");

const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const locationRoute = require("./location.route");

const router = express.Router();

const defaultRoutes = [
    {
        path: "/auth",
        route: authRoute,
    },
    {
        path: "/users",
        route: userRoute,
    },
    {
        path: "/locations",
        route: locationRoute,
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
