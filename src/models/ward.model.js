const mongoose = require("mongoose");

const { toJSON } = require("./plugins");

const wardSchema = mongoose.Schema(
    {
        wardId: {
            type: String,
            required: true,
        },
        districtId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "District",
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

wardSchema.plugin(toJSON);

/**
 * @typedef Ward
 */
const Ward = mongoose.model("Ward", wardSchema);

module.exports = Ward;
