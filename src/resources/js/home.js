import Splide from "@splidejs/splide";

const renderSplide = () => {
    const splideContainer = document.querySelector(".splide");
    const width = splideContainer.clientWidth;
    const splideOptions = {
        type: "loop",
        autoWidth: true,
        focus: "center",
        lazyLoad: "nearby",
        autoplay: true,
    };
    if (width < 768) {
        splideOptions.heightRatio = 9 / 16;
    }
    const splide = new Splide(".splide", splideOptions);
    splide.mount();
};

(() => {
    renderSplide();
})();
