import { opt } from "./lib/services/opt.js";

export default {
  wallpaper: opt<string>("wallpaper"),
  dark_mode: opt<boolean>("dark-mode"),
  weather: {
    provider: opt<string>("provider"),
    temp_unit: opt<number>("temp-unit"),
    location_type: opt<string>("location-type"),
    location: opt<Array<string>>("location"),
    api_key: opt<string>("api-key"),
  },
};
