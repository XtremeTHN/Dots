import { Category, Opt } from "./lib/services/opt.js";

let r = new Category("root");

let w = new Category("Weather");
let w_conf = {
  provider: w.get_config<string>("provider"),
  temp_unit: w.get_config<string>("temp-unit"),
  location_type: w.get_config<string>("location-type"),
  location: w.get_config<Array<string>>("location"),
  update_time: w.get_config<number>("update-time"),
  api_key: w.get_config<string>("api-key"),

  weather: w,
};

let n = new Category("Notifications");

let n_config = {
  popupCloseDelay: n.get_config<number>("popup-close-delay"),
  position: n.get_config<string>("position", true),
  shouldOverlayWindows: n.get_config<boolean>("overlay-windows", true),
  notifications: n,
};

export default {
  wallpaper: r.get_config<string>("wallpaper"),
  dark_mode: r.get_config<boolean>("dark-mode"),
  weather: w_conf,
  notifications: n_config,
};
