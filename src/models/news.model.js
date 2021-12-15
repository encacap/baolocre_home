const mongoose = require("mongoose");

const { toJSON, paginate } = require("./plugins");

const newsSchema = mongoose.Schema(
    {
        isPublished: {
            type: Boolean,
            default: true,
        },
        title: {
            type: String,
            required: true,
        },
        category: {
            name: {
                type: String,
                required: true,
            },
            slug: {
                type: String,
                required: true,
            },
        },
        content: {
            type: String,
            required: true,
        },
        priority: {
            type: Number,
            default: Date.now(),
        },
        source: {
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
    },
    {
        timestamps: true,
    }
);

newsSchema.index({ title: "text" });

newsSchema.plugin(toJSON);
newsSchema.plugin(paginate);

/**
 * @typedef News
 */
const News = mongoose.model("News", newsSchema);

module.exports = News;
