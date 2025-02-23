/** @type {import('next-i18next').UserConfig} */
const config = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru"],
  },
  defaultNS: "common",
  localePath: "public/locales",
};

process.env.I18NEXT_DEFAULT_CONFIG_PATH = "./next-i18next.config.cjs";

module.exports = config;
