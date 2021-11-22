// eslint-disable-next-line import/no-extraneous-dependencies
import Splide from "@splidejs/splide";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Video } from "@splidejs/splide-extension-video";

const renderSplide = () => {
    const splideSelectedIndexContainer = document.querySelector("#splideSelectedIndex");
    const splide = new Splide(".splide", {
        type: "loop",
        autoWidth: true,
        focus: "center",
        lazyLoad: "nearby",
        video: {
            loop: true,
            playerOptions: {
                youtube: {
                    showinfo: 0,
                    rel: 0,
                    controls: 0,
                    modestbranding: 1,
                },
            },
            volume: 1,
        },
    });

    splide.on("mounted move", () => {
        splideSelectedIndexContainer.innerText = splide.index + 1;
    });

    const thumbnails = new Splide("#thumbnail-slider", {
        fixedWidth: 60,
        fixedHeight: 80,
        isNavigation: true,
        arrows: false,
        cover: true,
    });

    splide.sync(thumbnails);
    splide.mount({ Video });
    thumbnails.mount();
};

(() => {
    renderSplide();
})();
