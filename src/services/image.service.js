const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const cloudinaryConfig = require("../../cloudinary.config");
const { getRandomInteger } = require("../utils/helpers");

const getCloudinaryConfig = (name) => {
    const clouds = Object.keys(cloudinaryConfig).reduce((acc, key) => {
        const cloudsOfType = cloudinaryConfig[key];
        // eslint-disable-next-line no-param-reassign
        acc = {
            ...acc,
            ...cloudsOfType,
        };
        return acc;
    }, {});
    const cloudKeys = Object.keys(clouds);

    if (name) {
        return clouds[name];
    }

    const cloudsLength = cloudKeys.length;

    return clouds[cloudKeys[getRandomInteger(0, cloudsLength - 1)]];
};

const createSignature = (type) => {
    const timestamp = new Date().getTime();

    if (!type) {
        // eslint-disable-next-line no-param-reassign
        type = "estate";
    }

    const cloudinaryCloud = getCloudinaryConfig();
    const folder = `baolocre_${type}`;
    const eager = "c_thumb,g_center,w_300|c_thumb,g_center,w_400|c_thumb,g_center,w_80";
    const configs = {
        eager,
        folder,
        timestamp,
    };

    const configString = Object.keys(configs)
        .map((configKey) => {
            const configValue = configs[configKey];
            return `${configKey}=${configValue}`;
        })
        .join("&")
        .concat(cloudinaryCloud.secret);

    return {
        ...configs,
        signature: crypto.createHash("sha1").update(configString).digest("hex"),
        name: cloudinaryCloud.name,
        preset: cloudinaryCloud.preset,
        key: cloudinaryCloud.key,
    };
};

const deleteImages = async (images) => {
    const deleteImagesByCloud = {};
    const promises = [];
    images.forEach((image) => {
        const { name: cloudName } = image;
        if (!deleteImagesByCloud[cloudName]) {
            deleteImagesByCloud[cloudName] = [];
        }
        deleteImagesByCloud[cloudName].push(image);
    });
    Object.keys(deleteImagesByCloud).forEach((cloudName) => {
        const deletedImages = deleteImagesByCloud[cloudName];
        const imagesIds = deletedImages.map((image) => image.publicId);
        const cloud = getCloudinaryConfig(cloudName);
        cloudinary.config({
            cloud_name: cloud.name,
            api_key: cloud.key,
            api_secret: cloud.secret,
        });
        promises.push(cloudinary.api.delete_resources(imagesIds));
    });
    await Promise.all(promises);
    return images;
};

module.exports = {
    createSignature,
    deleteImages,
};
