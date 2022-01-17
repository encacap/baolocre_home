const mongoose = require("mongoose");

const { toJSON, paginate } = require("./plugins");

const Counter = require("./counter.model");

const estateSchema = mongoose.Schema(
    {
        customId: {
            type: String,
        },
        priority: {
            type: Number,
            default: Date.now(),
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        title: {
            type: String,
        },
        price: {
            type: String,
        },
        area: {
            type: Number,
        },
        category: {
            name: {
                type: String,
            },
            slug: {
                type: String,
            },
        },
        properties: {
            type: [
                {
                    name: {
                        type: String,
                    },
                    value: {
                        type: String,
                    },
                },
            ],
        },
        location: {
            city: {
                cityId: {
                    type: mongoose.Schema.Types.ObjectId,
                },
                name: {
                    type: String,
                },
                slug: {
                    type: String,
                },
            },
            district: {
                districtId: {
                    type: mongoose.Schema.Types.ObjectId,
                },
                name: {
                    type: String,
                },
                slug: {
                    type: String,
                },
            },
            ward: {
                wardId: {
                    type: mongoose.Schema.Types.ObjectId,
                },
                name: {
                    type: String,
                },
                slug: {
                    type: String,
                },
            },
            street: {
                type: String,
            },
        },
        contact: {
            name: {
                type: String,
            },
            phone: {
                type: String,
            },
        },
        description: {
            type: String,
        },
        avatar: {
            origin: {
                type: String,
            },
            resourceType: {
                type: String,
                enum: ["image", "video"],
            },
            cloud: {
                type: String,
            },
            action: {
                type: String,
            },
            version: {
                type: Number,
            },
            name: {
                type: String,
            },
            publicId: {
                type: String,
            },
            format: {
                type: String,
            },
        },
        pictures: {
            type: [
                {
                    origin: {
                        type: String,
                    },
                    resourceType: {
                        type: String,
                        enum: ["image", "video"],
                    },
                    cloud: {
                        type: String,
                    },
                    action: {
                        type: String,
                    },
                    version: {
                        type: Number,
                    },
                    name: {
                        type: String,
                    },
                    publicId: {
                        type: String,
                    },
                    format: {
                        type: String,
                    },
                },
            ],
        },
        youtube: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

estateSchema.index({ title: "text", customId: "text" });

estateSchema.plugin(toJSON);
estateSchema.plugin(paginate);

estateSchema.pre("save", async function (next) {
    const estate = this;
    if (estate.isNew) {
        const counter = await Counter.findOne({ name: "estate" });
        const seq = counter.seq + 1;
        if (!estate.customId) {
            estate.set("customId", seq);
        }
        counter.seq = seq;
        await counter.save();
    }
    next();
});

/**
 * @typedef Estate
 */
const Estate = mongoose.model("Estate", estateSchema);

module.exports = Estate;
