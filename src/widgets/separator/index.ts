import Widget from "resource:///com/github/Aylur/ags/widget.js";

export const Separator = (vertical=true) => Widget.Box({
    vexpand: vertical,
    hexpand: !vertical
})