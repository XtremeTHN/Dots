import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { Separator } from "src/widgets/separator/index.js";
import { Time } from "src/lib/variables.js";

const TopBarCenter = () =>
  Widget.EventBox({
    class_name: "topbar-date",
    child: Widget.Label({
      label: Time.bind("value"),
    }),
  });

const TopBarContent = () =>
  Widget.CenterBox({
    class_name: "topbar",
    centerWidget: TopBarCenter(),
  });

export default () =>
  Widget.Window({
    name: "bottom-bar",
    child: TopBarContent(),
    exclusivity: "exclusive",
    anchor: ["left", "right", "top"],
  });
