const convertStringToSlug = (string) => {
    let slug = string.toLowerCase();
    slug = slug.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a");
    slug = slug.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e");
    slug = slug.replace(/(ì|í|ị|ỉ|ĩ)/g, "i");
    slug = slug.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o");
    slug = slug.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u");
    slug = slug.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y");
    slug = slug.replace(/(đ)/g, "d");
    slug = slug.replace(/([^0-9a-z-\s])/g, "");
    slug = slug.replace(/(\s+)/g, "-");
    slug = slug.replace(/^-+/g, "");
    slug = slug.replace(/-+$/g, "");
    return slug;
};

const normalizeSquareAreaString = (string) => {
    if (string.includes("m2")) {
        return string.replace("m2", "m<sup>2</sup>");
    }
    return string;
};

const normalizeEstateData = (data) => {
    const estate = data;
    const { id, title, category, price, area, location, pictures } = estate;
    const { city, district, ward, street } = location;
    estate.price = normalizeSquareAreaString(price);
    estate.area = normalizeSquareAreaString(area);
    estate.location = `${city.name}, ${district.name}, ${ward.name}, ${street}`;
    estate.shortLocation = `${city.name}, ${district.name}`;
    estate.url = `/bat-dong-san-ban/${category.slug}/${city.slug}/${district.slug}/${
        ward.slug
    }/${id}/${convertStringToSlug(title)}`;
    estate.pictures = pictures
        .map((image) => {
            const { origin, cloudName, type, action, version, folder, publicId, format, isAvatar } = image;
            const generateUrl = (options) => {
                let url = `${origin}/${cloudName}/${type}/${action}/`;
                if (options) {
                    url += `${options}/`;
                }
                url += `v${version}/`;
                if (folder) {
                    url += `${folder}/`;
                }
                url += `${publicId}.${format}`;
                return url;
            };
            if (type !== "image") {
                if (isAvatar) {
                    estate.avatar = image;
                    return [];
                }
                return image;
            }
            const originOptions = "q_auto,f_auto";
            const thumbnailOptions = "q_auto,f_auto,c_thumb,g_center,w_300";
            const largeThumbnailOptions = "q_auto,f_auto,c_thumb,g_center,w_400";
            const smallThumbnailOptions = "q_auto,f_auto,c_thumb,g_center,w_60";
            const results = {
                origin: generateUrl(originOptions),
                thumbnail: generateUrl(thumbnailOptions),
                largeThumbnail: generateUrl(largeThumbnailOptions),
                smallThumbnail: generateUrl(smallThumbnailOptions),
                isAvatar,
            };
            if (isAvatar) {
                estate.avatar = results;
                return [];
            }
            return results;
        })
        .filter((image) => image);
    return estate;
};

const normalizeEstatesData = (data) => {
    const { results } = data;
    const estates = results.map((estate) => normalizeEstateData(estate));
    // eslint-disable-next-line no-param-reassign
    delete data.results;
    return {
        results: estates,
        ...data,
    };
};

module.exports = {
    normalizeEstateData,
    normalizeEstatesData,
};
