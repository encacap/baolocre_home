const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { locationService, estateService, imageService } = require("../services");
const { getEstateProperties, normalizeEstatesData, removeFroalaCopyright } = require("../utils/helpers");
const { isMongoObjectId } = require("../utils/validator");

const createEstate = catchAsync(async (req, res) => {
    const {
        category: categorySlug,
        estate_id: customId,
        city: cityId,
        district: districtId,
        ward: wardId,
        street,
        contact_name: contactName,
        contact_phone: contactPhone,
        description,
    } = req.body;
    const [city, district, ward] = await Promise.all([
        cityId && locationService.getCityById(cityId),
        districtId && locationService.getDistrictById(districtId),
        wardId && locationService.getWardById(wardId),
    ]);
    const category = estateService.getCategoryBySlug(categorySlug, false);
    const estateBody = {
        ...req.body,
        customId,
        category,
        properties: getEstateProperties(req.body),
        location: {
            city,
            district,
            ward,
            street,
        },
        contact: {
            name: contactName,
            phone: contactPhone,
        },
        description: removeFroalaCopyright(description),
    };
    const estate = await estateService.createEstate(estateBody);
    res.status(201).json(estate);
});

const getEstates = catchAsync(async (req, res) => {
    const filters = pick(req.query, ["customId", "isPublished"]);
    const options = pick(req.query, ["limit", "page", "sortBy"]);
    if (filters.customId) {
        filters.customId = { $regex: filters.customId, $options: "i" };
    }
    const estates = await estateService.queryEstates(filters, options);
    if (filters.isPublished) {
        res.json(normalizeEstatesData(estates));
    } else {
        res.json(estates);
    }
});

const getEstate = catchAsync(async (req, res) => {
    const { id: estateId } = req.params;
    let estate;
    if (isMongoObjectId(estateId)) {
        estate = await estateService.getEstateById(estateId);
    } else {
        estate = await estateService.getEstateByCustomId(estateId);
    }
    if (!estate) {
        throw new ApiError(httpStatus.NOT_FOUND, "Estate not found");
    }
    res.json(estate);
});

const updateEstate = catchAsync(async (req, res) => {
    const { id: estateId } = req.params;
    const { body: estateBody } = req;
    const estate = await estateService.getEstateById(estateId);
    const { avatar, pictures } = estate;
    const { avatar: updatedAvatar, pictures: updatedPictures } = estateBody;
    const { category: categorySlug } = estateBody;
    const { contact_name: contactName, contact_phone: contactPhone } = estateBody;
    const category = estateService.getCategoryBySlug(categorySlug, false);
    const { city: cityId, district: districtId, ward: wardId, street } = estateBody;
    const [city, district, ward] = await Promise.all([
        cityId && locationService.getCityById(cityId),
        districtId && locationService.getDistrictById(districtId),
        wardId && locationService.getWardById(wardId),
    ]);
    estateBody.location = { street };
    estateBody.contact = { name: contactName, phone: contactPhone };

    if (city) {
        estateBody.location.city = {
            cityId: city._id,
            name: city.name,
            slug: city.slug,
        };
    }
    if (district) {
        estateBody.location.district = {
            districtId: district._id,
            name: district.name,
            slug: district.slug,
        };
    }
    if (ward) {
        estateBody.location.ward = {
            wardId: ward._id,
            name: ward.name,
            slug: ward.slug,
        };
    }

    estateBody.category = category;
    const unnecessaryPictures = [];
    if (avatar.publicId !== updatedAvatar.publicId) {
        unnecessaryPictures.push(avatar);
    }
    pictures.forEach((picture) => {
        const { publicId } = picture;
        if (!updatedPictures.find((updatedPicture) => updatedPicture.publicId === publicId)) {
            unnecessaryPictures.push(picture);
        }
    });
    const [updatedEstate] = await Promise.all([
        estateService.updateEstateById(estateId, estateBody),
        imageService.deleteImages(unnecessaryPictures),
    ]);
    res.json(updatedEstate);
});

const deleteEstate = catchAsync(async (req, res) => {
    const { id: estateId } = req.params;
    const estate = await estateService.getEstateById(estateId);
    const estatePictures = [...estate.pictures, estate.avatar].filter((picture) => picture.resourceType === "image");
    await Promise.all([imageService.deleteImages(estatePictures), estateService.deleteEstate(estate)]);
    res.status(204).end();
});

module.exports = {
    createEstate,
    getEstates,
    getEstate,
    updateEstate,
    deleteEstate,
};
