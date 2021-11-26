const mongoose = require("mongoose");

const { toJSON } = require("./plugins");

const citySchema = mongoose.Schema(
    {
        cityId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

citySchema.plugin(toJSON);

/**
 * @typedef City
 */
const City = mongoose.model("City", citySchema);

module.exports = City;
