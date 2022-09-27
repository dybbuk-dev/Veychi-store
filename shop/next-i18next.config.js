const path = require("path");
module.exports = {
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "es",
  },
  localePath: path.resolve("./public/locales"),
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
