import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Network from "resource:///com/github/Aylur/ags/service/network.js";

import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { AccessPoint } from "types/@girs/nm-1.0/nm-1.0.cjs";

let StopUpdating = false;

const Page = (content, title, stack, target) =>
  Widget.Revealer({
    transition: "slide_down",
    transitionDuration: 600,
    child: Widget.Box({
      vertical: true,
      class_name: "quicksettings",
      spacing: 10,
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
        Widget.Scrollable({
          css: "min-height: 450px",
          child: content,
          vexpand: true,
        }),
      ],
    }),
  }).hook(
    stack,
    (self) => {
      setTimeout(() => (self.reveal_child = stack.shown == target), 0);
    },
    "notify::shown",
  );

const WifiItem = (ap) => {
  let error_label = Widget.Label({
    label: "Password:",
    xalign: 0,
  });
  let revealer = Widget.Revealer({
    revealChild: false,
    transitionDuration: 400,
    transition: "slide_down",
    child: Widget.Box({
      vertical: true,
      spacing: 5,
      margin_top: 10,
      margin_bottom: 10,
      children: [
        error_label,
        Widget.Entry({
          on_accept: ({ text }) => {
            error_label.label = "Connecting...";
            execAsync([
              "nmcli",
              "dev",
              "wifi",
              "connect",
              ap.ssid,
              "password",
              text,
            ])
              .then(() => (StopUpdating = false))
              .catch((out) => {
                error_label.visible = true;
                error_label.label = out;
              });
          },
        }),
      ],
    }),
  });

  let btt_content = Widget.Box({
    spacing: 10,
    hexpand: true,
    children: [
      Widget.Icon({
        icon: ap.iconName,
        size: 16,
      }),
      Widget.Label({
        label: ap.ssid,
      }),
    ],
  });

  if (Network.wifi.ssid == ap.ssid) {
    btt_content.add(
      Widget.Label({
        label: "Connected",
        hpack: "end",
        hexpand: true,
      }),
    );
  }

  return Widget.Box({
    vertical: true,
    children: [
      Widget.Button({
        on_clicked: () => {
          revealer.reveal_child = !revealer.reveal_child;
          StopUpdating = revealer.reveal_child;
        },
        hexpand: true,
        child: btt_content,
      }),
      revealer,
    ],
  });
};

export const WifiMenu = (stack) =>
  Page(
    Widget.Box({
      vertical: true,
      setup: (self) => {
        if (Network.wifi.state !== "unknown") {
          self.hook(
            Network.wifi,
            () => {
              if (StopUpdating) {
                return;
              }

              let children = [];
              for (let ap of Network.wifi.access_points) {
                children.push(WifiItem(ap));
              }

              self.children = children;
            },
            "notify::access-points",
          );
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
    "wifi-menu",
  );
