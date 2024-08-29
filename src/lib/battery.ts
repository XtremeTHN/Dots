import Battery from "resource:///com/github/Aylur/ags/service/battery.js";

let notified = false;

Battery.connect("notify::percent", () => {
  if (Battery.percent == 20) {
    if (notified) {
      Utils.notify("Battery low", "Charge your device", "battery-low-symbolic");
    }
  } else if (Battery.percent == 5) {
    if (notified) {
      Utils.notify("Battery low", "Charge your device", "battery-low-symbolic");
    }
  } else {
    notified = false;
  }
});
