const notifications = await Service.import("notifications");
import { type Notification } from "types/service/notifications";

const NotificationIcon = ({ app_entry, app_icon, image }: Notification) => {
  if (image) {
    return Widget.Box({
      vpack: "start",
      hexpand: false,
      class_name: "icon img",
      css: `
                background-image: url("${image}");
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                border-radius: 16px;
                min-width: 78px;
                min-height: 78px;
            `,
    });
  }

  let icon = "dialog-information-symbolic";
  if (Utils.lookUpIcon(app_icon)) icon = app_icon;

  if (Utils.lookUpIcon(app_entry || "")) icon = app_entry || "";

  return Widget.Box({
    vpack: "start",
    hexpand: false,
    class_name: "icon",
    css: `
            min-width: 78px;
            min-height: 78px;
        `,
    child: Widget.Icon({
      icon,
      size: 58,
      hpack: "center",
      hexpand: true,
      vpack: "center",
      vexpand: true,
    }),
  });
};

export default (noti: Notification) => {
  let box = Widget.Box({
    spacing: 10,
    children: [
      NotificationIcon(noti),
      Widget.Box({
        vertical: true,
        spacing: 5,
        children: [
          Widget.Label({
            class_name: "title-3",
            xalign: 0,
            justification: "left",
            hexpand: true,
            max_width_chars: 24,
            truncate: "end",
            wrap: true,
            label: noti.summary.trim(),
          }),
          Widget.Label({
            label: noti.body.trim(),
            hexpand: true,
            use_markup: true,
            xalign: 0,
            justification: "left",
          }),
        ],
      }),
    ],
  });

  let actions =
    noti.actions.length < 0
      ? null
      : Widget.Revealer({
          transition: "slide_down",
          child: Widget.Box({
            children: noti.actions.map((action) =>
              Widget.Button({
                on_clicked: () => {
                  noti.invoke(action.id);
                },
                hexpand: true,
                child: Widget.Label(action.label),
              }),
            ),
          }),
        });

  let event_box = Widget.EventBox({
    vexpand: false,
    on_primary_click: noti.dismiss,
    on_hover() {
      if (actions) actions.reveal_child = true;
    },
    on_hover_lost() {
      if (actions) actions.reveal_child = false;
    },
    child: Widget.Box({
      vertical: true,
      children: actions ? [box, actions] : [],
    }),
  });

  return Widget.Box({
    class_name: `notification ${noti.urgency}`,
    name: "root",
    css: "min-width: 300px;",
    child: event_box,
  });
};
