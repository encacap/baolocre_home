const generateImageUrl = (data, options) => {
    const { origin, name, resourceType, action, version, publicId, format } = data;
    let url = `${origin}/${name}/${resourceType}/${action}/`;
    if (options?.eager) {
        url += `${options?.eager}/`;
    } else {
        url += `q_auto,f_auto/`;
    }
    url += `v${version}/`;
    url += `${publicId}.${format}`;
    return url;
};

module.exports = {
    generateImageUrl,
};
