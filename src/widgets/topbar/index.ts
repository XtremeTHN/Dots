import Widget from "resource:///com/github/Aylur/ags/widget.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import Battery from "resource:///com/github/Aylur/ags/service/battery.js";
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";

import { Workspaces } from "../../lib/hyprfuncs.js";
import { Separator } from "../separator/index.js";
import { Time } from "../../lib/variables.js";

const truncateWindowName = (wmName, maxLength=32) => {
  if (wmName.length > maxLength) {
    return wmName.slice(0, maxLength) + '...';
  } else {
    return wmName
  }
}

const WindowName = () => Widget.Label({
  class_name: "topbar-active-window",
}).hook(Hyprland, self => {
    self.label = truncateWindowName(Hyprland.active.client.title.length === 0 ? `Workspace ${Hyprland.active.workspace.id}` : Hyprland.active.client.title)
})

const TopBarStart = () => Widget.Box({
  spacing: 5,
  children: [
    Workspaces(),
    WindowName()
  ],
  vexpand: true
})

const TopBarCenter = () => Widget.EventBox({
  vexpand: true,
  class_name: "topbar-date",
  child: Widget.Label({
      label: Time.bind("value")
    })
})

const TopBarEnd = () => Widget.Box({
  children: [
    Separator(false),
    Widget.Box({
      spacing: 2,
      children: [
        Widget.Icon({
          icon: Battery.bind("icon_name")
        }),
        Widget.Label({
          label: Battery.bind("percent").transform(p => `${p}%`)
        })
      ]
    })
  ]
})

const TopBarContent = () => Widget.CenterBox({
  class_name: "topbar",
  startWidget: TopBarStart(),
  centerWidget: TopBarCenter(),
  endWidget: TopBarEnd()
})

export default () => Widget.Window({
  name: "bottom-bar",
  child: TopBarContent(),
  exclusivity: "exclusive",
  anchor: ["left", "right", "top"]
})
