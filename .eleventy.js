module.exports = function(eleventyConfig) {
  // Pass through files and folders
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("llms.txt");
  eleventyConfig.addPassthroughCopy("llms-full.txt");

  // Date filters for sitemap and RSS feed
  eleventyConfig.addFilter("isoDate", function(date) {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("rfc822Date", function(date) {
    if (!date) return new Date().toUTCString();
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes"
    },
    htmlTemplateEngine: "njk"
  };
};
