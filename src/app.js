const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ThrowError = require("./utils/ThrowError");

const app = express();

if (config.env !== "test") {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: false,
            directives: {
                defaultSrc: ["'self' 'unsafe-inline'", "res.cloudinary.com", "www.youtube.com", "img.youtube.com"],
                scriptSrc: ["'self'", "unpkg.com", "www.youtube.com"],
                connectSrc: ["'self'", "unpkg.com"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
    })
);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// set assets resources path
app.use("/assets", express.static(path.join(__dirname, "assets")));

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
    app.use("/api/v1/auth", authLimiter);
}

// v1 api routes
app.use("/", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ThrowError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ThrowError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
