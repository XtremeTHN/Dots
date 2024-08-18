import Bluetooth from "resource:///com/github/Aylur/ags/service/bluetooth.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { toTitle } from "./tools.js";

export const BluetoothIcon = Bluetooth.bind("enabled").transform(e => e ? "bluetooth-active-symbolic" : "bluetooth-disabled-symbolic")

export const BluetoothState = Bluetooth.bind("enabled").transform(e => e ? "On" : "Off")
export const BluetoothFirstDeviceConnected = Bluetooth.bind("connected_devices").transform(c => c.length > 0 ? c.at(0)?.alias : "Bluetooth")
// {
//     if (Bluetooth.enabled) {
//         return "On"
//     } else {
//         return "Bluetooth disabled"
//     }
// })

export const bluetooth_active_handler = (self) => {
    self.toggleClassName("active", Bluetooth.enabled)
}