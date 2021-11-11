import Splide from "@splidejs/splide";

const renderSplide = () => {
    const splide = new Splide(".splide", {
        type: "loop",
        autoWidth: true,
        focus: "center",
        lazyLoad: "nearby",
    });

    var thumbnails = new Splide("#thumbnail-slider", {
        fixedWidth: 60,
        fixedHeight: 80,
        isNavigation: true,
        arrows: false,
        cover: true,
    });

    splide.sync(thumbnails);
    splide.mount();
    thumbnails.mount();
};

(() => {
    renderSplide();
})();
