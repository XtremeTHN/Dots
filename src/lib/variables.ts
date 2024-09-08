import GLib from "gi://GLib";
import { exec } from "resource:///com/github/Aylur/ags/utils/exec.js";

/**
 * Returns user config dir, /home/USER/.config
 */
export const UserConfigDir = GLib.get_user_config_dir();

export const UserHome = `/home/${GLib.get_user_name()}/`;

export const Time = Variable("", {
  poll: [1000, () => GLib.DateTime.new_now_local().format("%I:%M %p %A")],
});

export const UpTime = Variable("up 0 hours, 0 minutes", {
  poll: [1000, ["uptime", "-p"]],
});

export const User = GLib.get_user_name();

export const STYLE_PATH = `${App.configDir}/src/styles`;
