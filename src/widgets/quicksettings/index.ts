import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { WifiMenu, BluetoothMenu } from "./quickpages.js";
import {
  QuickSettingsTop,
  QuickSettingsMiddle,
  QuickSettingsBottom,
} from "./quickwidgets.js";
import MprisWidget from "./music.js";

export default () =>
  Widget.Window({
    name: "quicksettings",
    class_name: "quicksettings-window",
    margins: [25, 20],
    anchor: ["right", "top"],
    keymode: "on-demand",
    visible: false,
    child: Widget.Box({
      spacing: 10,
      children: [
        Widget.Stack({
          transition: "slide_left_right",
          hexpand: true,
          setup: (self) => {
            self.children = {
              main: Widget.Box({
                vertical: true,
                class_name: "quicksettings",
                spacing: 10,
                children: [
                  QuickSettingsTop(),
                  QuickSettingsMiddle(self),
                  QuickSettingsBottom(),
                ],
              }),
              "wifi-menu": WifiMenu(self),
              "bluetooth-menu": BluetoothMenu(self),
            };
          },
        }),
        MprisWidget(),
      ],
    }),
  });
