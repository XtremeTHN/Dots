import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Network from "resource:///com/github/Aylur/ags/service/network.js";

import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { AccessPoint } from "types/@girs/nm-1.0/nm-1.0.cjs";
import Bluetooth from "resource:///com/github/Aylur/ags/service/bluetooth.js";

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
          child: content,
          class_name: "quicksettings-container",
          max_content_height: 250,
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
        class_name: "flat",
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
      vexpand: true,
      // @ts-ignore
      children: Network.wifi.bind("access_points").as((a) => {
        if (stack.shown !== "wifi-menu") return [];

        if (StopUpdating) return;
        console.debug("Updating wifi quicksettings");
        return a.map(WifiItem);
      }),
    }).hook(
      stack,
      (self) => {
        if (stack.shown === "wifi-menu")
          self.children = Network.wifi.access_points.map(WifiItem);
      },
      "notify::shown",
    ),
    "Network",
    stack,
    "wifi-menu",
  );

const BluetoothDevice = (device) =>
  Widget.Box({
    spacing: 10,
    children: [
      Widget.Icon({
        icon: device.icon_name,
        size: 16,
      }),
      Widget.Label(device.name == null ? "No name" : device.name),
      Widget.Spinner({
        active: device.bind("connecting"),
        visible: device.bind("conecting"),
        hpack: "end",
        hexpand: true,
      }),
      Widget.Switch({
        active: device.bind("connected"),
        hpack: "end",
        hexpand: true,
        visible: device.bind("connecting").as((p) => !p),
        onActivate: ({ active }) => {
          device.setConnection(active);
        },
      }),
    ],
  });

export const BluetoothMenu = (stack) =>
  Page(
    Widget.Box({
      vertical: true,
      spacing: 15,
      children: [
        Widget.Box({
          vertical: true,
          children: Bluetooth.bind("devices").as((v) => {
            if (stack.shown !== "bluetooth-menu") return [];

            return v.map(BluetoothDevice);
          }),
        }).hook(
          stack,
          (self) => {
            if (stack.shown === "bluetooth-menu")
              self.children = Bluetooth.devices.map(BluetoothDevice);
          },
          "notify::shown",
        ),
      ],
    }),
    "Bluetooth",
    stack,
    "bluetooth-menu",
  );
