import { opt } from "./lib/services/opt.js";

export default {
  wallpaper: opt("wallpaper"),
  dark_mode: opt("dark-mode"),
  weather: {
    provider: opt("provider"),
    temp_unit: opt<number>("temp-unit"),
    location: {
      city_name: opt<string>("current-city-name"),
      lat: opt<number>("latitude"),
      lon: opt<number>("longitude"),
    },
  },
};
