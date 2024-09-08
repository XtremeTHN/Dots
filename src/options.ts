import { opt } from "./lib/services/opt.js";

export default {
  wallpaper: opt("wallpaper"),
  dark_mode: opt("dark-mode"),
  provider: opt("provider"),
  location: {
    city_name: opt("current-city-name"),
    lat: opt("latitude"),
    long: opt("longitude"),
  },
};
