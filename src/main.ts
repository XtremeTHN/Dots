import TopBarWindow from "./widgets/topbar/index.js";
import QuickSettings from "./widgets/quicksettings/index.js";
import Notifications from "./widgets/notifications/index.js";
import { CornerTopleft, CornerTopright } from "./widgets/corners/index.js";

App.config({
  windows: [TopBarWindow(), QuickSettings(), Notifications()],
  style: `${App.configDir}/src/styles/style.css`,
});

CornerTopleft();
CornerTopright();
