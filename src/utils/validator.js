const isMongoObjectId = (id) => {
    const string = String(id);
    return string.match(/^[0-9a-fA-F]{24}$/);
};

module.exports = {
    isMongoObjectId,
};
