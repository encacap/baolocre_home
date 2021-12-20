const mongoose = require("mongoose");

const { toJSON } = require("./plugins");

const configSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        value: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

configSchema.plugin(toJSON);

/**
 * @typedef Config
 */
const Config = mongoose.model("Config", configSchema);

module.exports = Config;
