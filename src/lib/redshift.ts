import Widget from "resource:///com/github/Aylur/ags/widget.js";
import RedShift from "./services/clight.js";

export const RedShiftIcon = "night-light-symbolic"
export const RedShiftState = RedShift.bind("enabled").transform(e => e ? "On" : "Off")

export const redshift_active_handler = (self) => {
    self.toggleClassName("active", RedShift.enabled)
}