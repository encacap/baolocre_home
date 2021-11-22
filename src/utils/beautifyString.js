const beautifyPhoneNumber = (phoneNumber) => {
    return `${phoneNumber.substring(0, 4)} ${phoneNumber.substring(
        4,
        7
    )} ${phoneNumber.substring(7, 10)}`;
};

module.exports = {
    beautifyPhoneNumber,
};
