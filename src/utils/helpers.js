const { decodeHTML } = require("entities");
const striptags = require("striptags");
const dayjs = require("dayjs");

const { defaultAvatarForContact } = require("../config/config");
const { generateImageUrl } = require("./cloudinary");

const removeFroalaCopyright = (description) => {
    if (!description) return "";
    const standardDescription = description;
    if (standardDescription.includes("Powered by")) {
        const startIndex = standardDescription.lastIndexOf(`&lt;p data-f-id="pbf"`);
        return standardDescription.substring(0, startIndex);
    }
    return standardDescription;
};

const removeHTMLFormat = (string) => (string ? striptags(string).replace(/\n/g, ". ") : "");

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
    if (String(string).includes("m2")) {
        return String(string).replace("m2", "m<sup>2</sup>");
    }
    return string;
};

const normalizeEstateData = (data) => {
    const estate = data.toJSON?.() || data;
    const { id, estateId, title, category, price, area, properties, location, pictures, avatar, contact } = estate;
    let { description = "" } = estate;
    description = decodeHTML(description);
    const { city, district, ward, street } = location;
    const { avatar: contactAvatar, name, phone, zalo, email } = contact;
    let totalVideos = 0;
    let totalImages = 0;
    estate.customID = estateId;
    estate.properties = properties;
    estate.contact = {
        avatar: contactAvatar || defaultAvatarForContact,
        name,
        phone,
        friendlyPhone: phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3"),
        zalo,
        email,
    };
    estate.price = normalizeSquareAreaString(price);
    estate.area = normalizeSquareAreaString(`${area}m2`);
    estate.description = description;
    estate.plainDescription = removeHTMLFormat(description);
    estate.location.long = `${street ? `${street}, ` : ""}${ward.name}, ${district.name}, ${city.name}`;
    estate.location.short = `${city.name}, ${district.name}`;
    estate.location.reservedShort = `${district.name}, ${city.name}`;
    estate.url = `/bat-dong-san-ban/${category.slug}/${city.slug}/${district.slug}/${ward.slug}/${
        id || estate._id
    }/${convertStringToSlug(title)}`;
    estate.breadcrumb = [
        {
            name: "Bất động sản bán",
            url: "bat-dong-san-ban",
        },
        {
            name: category.name,
            url: category.slug,
        },
        {
            name: city.name,
            url: city.slug,
        },
        {
            name: district.name,
            url: district.slug,
        },
        {
            name: ward.name,
            url: ward.slug,
        },
    ];
    estate.pictures = [...pictures, { ...avatar, isAvatar: true }]
        .map((image) => {
            let results;
            const { origin, name: cloudName, resourceType, publicId, format, isAvatar } = image;
            const generateVideoImageUrl = () => `${origin}/${cloudName}/${publicId}/${format}`;
            const generateYoutubeVideoUrl = () => `https://www.youtube.com/watch?v=${publicId}`;
            if (resourceType !== "image") {
                const imageVideoUrl = generateVideoImageUrl();
                totalVideos += 1;
                results = {
                    video: generateYoutubeVideoUrl(),
                    origin: imageVideoUrl,
                    thumbnail: imageVideoUrl,
                    largeThumbnail: imageVideoUrl,
                    smallThumbnail: imageVideoUrl,
                    isAvatar,
                    type: resourceType,
                };
                if (isAvatar) {
                    estate.avatar = results;
                    return {};
                }
                return results;
            }
            const thumbnailOptions = "c_thumb,g_center,w_300";
            const largeThumbnailOptions = "c_thumb,g_center,w_400";
            const smallThumbnailOptions = "c_thumb,g_center,w_80";
            totalImages += 1;
            results = {
                origin: generateImageUrl(image),
                thumbnail: generateImageUrl(image, { eager: thumbnailOptions }),
                largeThumbnail: generateImageUrl(image, { eager: largeThumbnailOptions }),
                smallThumbnail: generateImageUrl(image, { eager: smallThumbnailOptions }),
                isAvatar,
                type: resourceType,
            };
            if (isAvatar) {
                estate.avatar = results;
                return undefined;
            }
            return results;
        })
        .filter((picture) => picture?.origin);
    if (!estate.avatar) {
        estate.avatar = estate.pictures.shift();
    }
    estate.totalVideos = totalVideos;
    estate.totalImages = totalImages;
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

const normalizeNewsData = (data) => {
    const news = data.toJSON?.() || data;
    const { avatar, updatedAt, id, title, category } = news;
    if (avatar) {
        news.avatarURLs = {
            original: generateImageUrl(avatar),
            thumbnail: generateImageUrl(avatar, { eager: "c_thumb,g_center,w_300" }),
            largeThumbnail: generateImageUrl(avatar, { eager: "c_thumb,g_center,w_400" }),
            smallThumbnail: generateImageUrl(avatar, { eager: "c_thumb,g_center,w_800" }),
        };
    }
    news.url = `/tin-tuc/${category?.slug}/${id || news._id}/${convertStringToSlug(title)}`;
    news.friendlyUpdatedTime = dayjs(updatedAt).format("HH:mm:ss - DD/MM/YYYY");
    news.decodedContent = decodeHTML(news.content);
    news.breadcrumb = [
        {
            name: "Tin tức",
            url: "tin-tuc",
        },
        {
            name: category?.name,
            url: category?.slug,
        },
    ];
    return news;
};

const normalizeSomeNewsData = (data) => {
    const { results } = data;
    const newsData = results.map((news) => normalizeNewsData(news));
    return {
        ...data,
        results: newsData,
    };
};

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getEstateProperties = (estate) => {
    const expectedProperties = {
        living_room: "Phòng khách",
        bedroom: "Phòng ngủ",
        bathroom: "Phòng tắm",
        direction: "Hướng",
        page: "Số tờ",
        plot: "Số thửa",
    };
    const properties = [];
    Object.keys(expectedProperties).forEach((key) => {
        if (estate[key]) {
            properties.push({
                name: expectedProperties[key],
                value: estate[key],
            });
        }
    });
    return properties;
};

module.exports = {
    normalizeEstateData,
    normalizeEstatesData,
    normalizeSomeNewsData,
    normalizeNewsData,
    convertStringToSlug,
    getRandomInteger,
    getEstateProperties,
    removeFroalaCopyright,
};
