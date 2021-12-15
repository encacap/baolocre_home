const allRoles = {
    user: ["getLocations"],
    admin: [
        "getUsers",
        "manageUsers",
        "getLocations",
        "manageLocations",
        "getImages",
        "manageImages",
        "getEstates",
        "manageEstates",
        "getNews",
        "manageNews",
    ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
    roles,
    roleRights,
};
