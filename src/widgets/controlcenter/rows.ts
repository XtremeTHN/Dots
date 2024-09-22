import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { Opt } from "src/lib/services/opt";

const RowTitle = (title) =>
  Widget.Label({
    className: "row-title",
    xalign: 0,
    label: title,
  });

const RowSubtitle = (subtitle) =>
  Widget.Label({
    label: subtitle,
    xalign: 0,
  });

export const SpinRow = (
  title: string,
  description: string,
  option: Opt<number>,
) => {
  return Widget.Box({
    className: "row",
    name: "SpinRow",
    children: [
      //@ts-ignore
      Widget.Box({
        name: "spin-row-text",
        vertical: true,
        spacing: 2,
        hexpand: true,
        hpack: "start",
        children: [RowTitle(title), RowSubtitle(description)],
      }),
      Widget.Box({
        spacing: 10,
        children: [
          Widget.SpinButton({
            value: option._as((n) => `${n}`),
            vpack: "center",
            increments: [100, 1000],
            maxWidthChars: 20,
            range: [0, 100000],
            onValueChanged: ({ value }) => {
              option.value = value;
            },
          }),
        ],
      }),
    ],
  });
};
