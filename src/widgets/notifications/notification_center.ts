import Widget from "resource:///com/github/Aylur/ags/widget.js";

import { NotificationIcon } from "./notification.js";
import { type Notification as typeNoti } from "types/service/notifications";
const notifications = await Service.import("notifications");

const NotificationsPlaceholder = () =>
  Widget.Box({
    vertical: true,
    vexpand: true,
    vpack: "center",
    visible: notifications.bind("notifications").as((n) => n.length === 0),
    spacing: 10,
    children: [
      Widget.Icon({
        icon: "notifications-disabled-symbolic",
        size: 72,
      }),
      Widget.Label("You don't have any notifications!"),
    ],
  });

const Notification = (n: typeNoti) => {
  let actions_revealer =
    n.actions.length > 0
      ? Widget.Revealer({
          child: Widget.Box({
            homogeneous: true,
            spacing: 2,
            children: n.actions.map((a) =>
              Widget.Button({
                className: "notification-center-item-button",
                onClicked: () => {
                  n.invoke(a.id);
                },
                child: Widget.Label(a.label),
              }),
            ),
          }),
        })
      : null;

  let button_revealer =
    n.actions.length > 0
      ? Widget.Button({
          className: "notification-center-item-button",
          vpack: "center",
          onClicked: () => {
            actions_revealer.reveal_child = !actions_revealer.reveal_child;
          },
          child: Widget.Icon({
            icon: "go-down-symbolic",
          }),
        })
      : Widget.Box();

  //@ts-ignore
  let notification = Widget.Box({
    spacing: 10,
    children: [
      NotificationIcon(n, 48),
      Widget.Box({
        vertical: true,
        hexpand: true,
        spacing: 2,
        children: [
          Widget.Label({
            xalign: 0,
            justification: "left",
            max_width_chars: 24,
            truncate: "end",
            wrap: true,
            className: "title-3",
            label: n.summary,
          }),
          Widget.Label({
            xalign: 0,
            justification: "left",
            max_width_chars: 24,
            truncate: "end",
            wrap: true,
            label: n.body,
          }),
        ],
      }),
      button_revealer,
    ],
  });

  return Widget.Box({
    className: "notification-center-item",
    spacing: 10,
    vertical: true,
    children: [
      notification,
      actions_revealer == null ? Widget.Box() : actions_revealer,
    ],
  });
};

const NotificationsList = () =>
  Widget.Box({
    vertical: true,
    visible: notifications.bind("notifications").as((n) => n.length > 0),
    spacing: 5,
    children: [
      Widget.Scrollable({
        child: Widget.Box({
          vertical: true,
          vpack: "start",
          spacing: 10,
          children: notifications
            .bind("notifications")
            .as((n) => n.map(Notification)),
        }),
      }),
      Widget.Button({
        className: "notification-center-clear-btt",
        onClicked: () => {
          notifications.Clear();
        },
        child: Widget.Box({
          hexpand: true,
          spacing: 10,
          children: [Widget.Icon("user-trash-symbolic"), Widget.Label("Clear")],
        }),
      }),
    ],
  });

const Calendar = () =>
  Widget.Calendar({
    className: "center-calendar",
    showDayNames: true,
    expand: true,
  });

const Weather = Widget.Box({});
const Center = () =>
  Widget.Box({
    className: "notification-center",
    homogeneous: true,
    spacing: 10,
    children: [
      Widget.Box({
        vertical: true,
        children: [NotificationsPlaceholder(), NotificationsList()],
      }),
      Calendar(),
    ],
  });

export default () =>
  Widget.Window({
    name: "notification-center",
    anchor: ["top"],
    margins: [10],
    visible: false,
    child: Center(),
  });
