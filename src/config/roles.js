const allRoles = {
    user: ["getLocations"],
    admin: ["getUsers", "manageUsers", "getLocations", "manageLocations"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
    roles,
    roleRights,
};
