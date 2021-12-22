const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

const generateSitemap = async (url, estates, newsArray) => {
    const categories = [];
    const estateURLs = estates.map((estate) => {
        const { category, url: estateURL, updatedAt } = estate;
        categories.push(`bat-dong-san-ban/${category.slug}`);
        return {
            url: estateURL,
            changefreq: "weekly",
            priority: 0.8,
            lastmod: updatedAt,
        };
    });
    const newsURLs = newsArray.map((news) => {
        const { url: newsURL, category } = news;
        categories.push(`tin-tuc/${category.slug}`);
        return {
            url: newsURL,
            changefreq: "weekly",
            priority: 0.8,
        };
    });
    const categoryURLs = [...new Set(categories)].map((categoryURL) => ({
        url: categoryURL,
        changefreq: "weekly",
        priority: 0.8,
    }));
    const links = [
        {
            url: "/",
            changefreq: "weekly",
            priority: 1,
        },
        ...estateURLs,
        ...newsURLs,
        ...categoryURLs,
    ];

    const stream = new SitemapStream({ hostname: url });

    return streamToPromise(Readable.from(links).pipe(stream)).then((data) => data.toString());
};

module.exports = {
    generateSitemap,
};
