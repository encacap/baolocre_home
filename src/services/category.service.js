const getCategories = (filters, options) => {
    if (filters.type === "estate") {
        return [
            {
                name: "Nghỉ dưỡng",
                slug: "nghi-duong",
            },
            {
                name: "Đất nền",
                slug: "dat-nen",
            },
            {
                name: "Nhà phố",
                slug: "nha-pho",
            },
        ];
    }
    return [
        {
            name: "Thông tin quy hoạch",
            slug: "thong-tin-quy-hoach",
        },
        {
            name: "Pháp lý Bất động sản",
            slug: "phap-ly-bat-dong-san",
        },
        {
            name: "Phân tích thị trường",
            slug: "phan-tich-thi-truong",
        },
    ];
};

module.exports = {
    getCategories,
};
