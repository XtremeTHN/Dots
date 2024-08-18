import Network from "resource:///com/github/Aylur/ags/service/network.js";
import { toTitle } from "./tools.js";

export const net_active_handler = (self) => {
    if (Network.primary === null) {
        self.toggleClassName("active", false)
        return
    }
    self.toggleClassName("active", Network[Network.primary].internet === "connected")
}

export const NetIcon = Network.bind("primary").transform(p => p !== null ? Network[p].icon_name : "network-wireless-offline-symbolic")

export const NetState = Network.bind("primary").transform(p => p == "wifi" ? `${toTitle(Network.wifi.internet)}${Network.wifi.ssid !== null ? ": " + Network.wifi.ssid : ""}` : toTitle(Network.wired.internet))

