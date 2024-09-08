import { opt } from "./lib/config.js";

export default {
  wallpaper: opt("wallpaper"),
  provider: opt("provider", true),
  location: {
    city_name: opt("current-city-name"),
    lat: opt("latitude"),
    long: opt("longitude"),
  },
};
