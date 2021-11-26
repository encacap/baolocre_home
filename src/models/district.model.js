const mongoose = require("mongoose");

const { toJSON } = require("./plugins");

const districtSchema = mongoose.Schema(
    {
        districtId: {
            type: String,
            required: true,
        },
        cityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "City",
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

districtSchema.plugin(toJSON);

/**
 * @typedef District
 */
const District = mongoose.model("District", districtSchema);

module.exports = District;
