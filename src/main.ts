import TopBarWindow from "./widgets/topbar/index.js";
import QuickSettings from "./widgets/quicksettings/index.js";
import Notifications from "./widgets/notifications/index.js";
import NotificationCenter from "./widgets/notifications/notification_center.js";
import { CornerTopleft, CornerTopright } from "./widgets/corners/index.js";

import options from "src/options.js";
import { initStyle } from "./lib/style.js";

import("src/lib/battery.js");

options.wallpaper.on_change(initStyle);
options.dark_mode.on_change(initStyle);
initStyle();

App.config({
  windows: [
    TopBarWindow(),
    QuickSettings(),
    Notifications(),
    NotificationCenter(),
  ],
  style: `${App.configDir}/src/styles/style.css`,
});

CornerTopleft();
CornerTopright();

// import Weather from "./lib/services/weather.js";

// Weather.connect("notify::temperature", () => {
//   console.log("temp: ", Weather.temperature);
// });
