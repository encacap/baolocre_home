const crypto = require("crypto");
const cloudinaryConfig = require("../../cloudinary.config");
const { getRandomInteger } = require("../utils/helpers");

const getCloudinaryConfig = (name) => {
    if (name) {
        return cloudinaryConfig[name];
    }
    const clouds = Object.keys(cloudinaryConfig);
    const cloudsLength = clouds.length;
    return cloudinaryConfig[clouds[getRandomInteger(0, cloudsLength - 1)]];
};

const createSignature = () => {
    const timestamp = new Date().getTime();
    const cloudinaryCloud = getCloudinaryConfig();
    const folder = "baolocre";
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

module.exports = {
    createSignature,
};
