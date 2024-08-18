import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { User, UpTime } from "../../lib/variables.js";
import { NetIcon, NetState, net_active_handler } from "../../lib/internet.js";
import {
  BluetoothIcon,
  BluetoothState,
  BluetoothFirstDeviceConnected,
  bluetooth_active_handler,
} from "../../lib/bluetooth.js";
import { AudioMixer } from "../../lib/audio.js";

import Network from "resource:///com/github/Aylur/ags/service/network.js";
import Bluetooth from "resource:///com/github/Aylur/ags/service/bluetooth.js";

// Shitty code
export const QuickSettingButton = ({
  icon,
  title,
  stack,
  subtitle,
  clicked_cb,
  active_object,
  active_handler,
  stack_page_menu_name,
  active_signal = "changed",
}) =>
  Widget.Overlay({
    child: Widget.Button({
      class_name: "quicksettings-middle-button",
      hexpand: true,
      on_clicked: clicked_cb,
      child: Widget.Box({
        spacing: 8,
        children: [
          Widget.Icon({
            class_name: "quicksettings-middle-button-icon",
            icon: icon,
            size: 28,
          }).hook(active_object, active_handler, active_signal),
          Widget.Box({
            vertical: true,
            children: [
              Widget.Label({
                xalign: 0,
                class_name: "quicksettings-middle-button-title",
                wrap: true,
                truncate: "end",
                maxWidthChars: 16,
                label: title,
              }).hook(active_object, active_handler, active_signal),

              Widget.Label({
                xalign: 0,
                class_name: "quicksettings-middle-button-subtitle",
                label: subtitle,
                wrap: true,
                truncate: "end",
                maxWidthChars: 21,
              }).hook(active_object, active_handler, active_signal),
            ],
          }),
        ],
      }),
    }).hook(active_object, active_handler, active_signal),
    overlays: [
      Widget.Button({
        hpack: "end",
        on_clicked: () => {
          stack.shown = stack_page_menu_name;
        },
        class_name: "quicksettings-middle-button-next",
        child: Widget.Icon({
          class_name: "quicksettings-middle-button-icon",
          icon: "go-next-symbolic",
          size: 16,
        }).hook(active_object, active_handler, active_signal),
      }).hook(active_object, active_handler, active_signal),
    ],
  });

const NetworkQuickSetting = (stack) =>
  QuickSettingButton({
    icon: NetIcon,
    stack: stack,
    title: "Internet",
    subtitle: NetState,
    clicked_cb: () => Network.toggleWifi(),
    stack_page_menu_name: "wifi-menu",
    active_object: Network,
    active_handler: net_active_handler,
  });

const BluetoothQuickSetting = (stack) =>
  QuickSettingButton({
    icon: BluetoothIcon,
    stack: stack,
    title: BluetoothFirstDeviceConnected,
    subtitle: BluetoothState,
    clicked_cb: () => Bluetooth.toggle(),
    stack_page_menu_name: "bluetooth-menu",
    active_object: Bluetooth,
    active_handler: bluetooth_active_handler,
  });

export const QuickSettingsMiddle = (stack) =>
  Widget.Box({
    spacing: 5,
    homogeneous: true,
    children: [
      Widget.Box({
        vertical: true,
        children: [NetworkQuickSetting(stack)],
      }),
      Widget.Box({
        vertical: true,
        children: [BluetoothQuickSetting(stack)],
      }),
    ],
  });

export const QuickSettingsTop = () =>
  Widget.Box({
    spacing: 10,
    children: [
      Widget.Box({
        css: `
            background-image: url("/home/${User.value}/Pictures/pfp.jpg");
            background-size: cover;
            background-position: center;
            min-height: 50px; min-width: 50px;
            border-radius: 8px;`,
      }),
      Widget.Box({
        vertical: true,
        hexpand: true,
        children: [
          Widget.Label({
            label: `${User.value.at(0)?.toUpperCase()}${User.value.slice(1)}`,
            xalign: 0,
          }),
          Widget.Label({
            css: "font-weight: normal; font-size: smaller",
            label: UpTime.bind("value"),
            xalign: 0,
          }),
        ],
      }),
      Widget.Box({
        spacing: 5,
        children: [
          Widget.Button({
            class_name: "quicksettings-top-button",
            child: Widget.Icon({
              icon: "applications-system-symbolic",
              size: 22,
            }),
          }),
          Widget.Button({
            class_name: "quicksettings-top-button",
            child: Widget.Icon({
              icon: "system-shutdown-symbolic",
              size: 22,
            }),
          }),
        ],
      }),
    ],
  });

export const QuickSettingsBottom = () =>
  Widget.Box({
    children: [AudioMixer()],
  });
