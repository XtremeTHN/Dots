import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Network from "resource:///com/github/Aylur/ags/service/network.js";

import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { AccessPoint } from "types/@girs/nm-1.0/nm-1.0.cjs";

const Page = (content, title, stack) =>
  Widget.Box({
    vertical: true,
    class_name: "quicksettings",
    children: [
      Widget.Box({
        spacing: 10,
        children: [
          Widget.Button({
            class_name: "circular",
            child: Widget.Icon({
              icon: "go-previous-symbolic",
              size: 24,
            }),
            on_clicked: () => {
              stack.shown = "main";
            },
          }),
          Widget.Label({
            class_name: "title-2",
            label: title,
            xalign: 0,
          }),
        ],
      }),
      content,
    ],
  });

const WifiItem = (ap) => {
  let error_label = Widget.Label({
    label: "Password:",
  });
  let revealer = Widget.Revealer({
    revealChild: false,
    transitionDuration: 600,
    transition: "slide_down",
    child: Widget.Box({
      children: [
        error_label,
        Widget.Entry({
          on_accept: ({ text }) => {
            execAsync([
              "nmcli",
              "dev",
              "wifi",
              "connect",
              ap.ssid,
              "password",
              text,
            ]).catch((out) => {
              error_label.visible = true;
              error_label.label = out;
            });
          },
        }),
      ],
    }),
  });

  return Widget.Box({
    children: [
      Widget.Button({
        on_clicked: () => (revealer.reveal_child = true),
        child: Widget.Box({
          children: [
            Widget.Icon({
              icon: ap.iconName,
              size: 8,
            }),
            Widget.Label({
              label: ap.ssid,
            }),
            Widget.Icon({
              icon: "emblem-ok-symbolic",
              hpack: "end",
              visible: ap.active,
              size: 8,
            }),
          ],
        }),
      }),
      revealer,
    ],
  });
};

export const WifiMenu = (stack) =>
  Page(
    Widget.Box({
      setup: (self) => {
        if (Network.wifi.state !== "unknown") {
          self.children = Network.wifi
            .bind("access_points")
            .transform((a) => a.map(WifiItem));
        } else {
          self.children = [
            Widget.Label({
              label: "Wifi not available",
            }),
          ];
        }
      },
    }),
    "Network",
    stack,
  );
