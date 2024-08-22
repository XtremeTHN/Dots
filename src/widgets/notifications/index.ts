import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Notification from "./notification.js";

const notifications = await Service.import("notifications");

function Animated(id: number) {
  const n = notifications.getNotification(id)!;
  const widget = Notification(n);

  const inner = Widget.Revealer({
    transition: "slide_left",
    transition_duration: 600,
    child: widget,
  });

  const outer = Widget.Revealer({
    transition: "slide_down",
    transition_duration: 600,
    child: inner,
  });

  const box = Widget.Box({
    hpack: "end",
    child: outer,
  });

  Utils.idle(() => {
    outer.reveal_child = true;
    Utils.timeout(600, () => {
      inner.reveal_child = true;
    });
  });

  return Object.assign(box, {
    dismiss() {
      inner.reveal_child = false;
      Utils.timeout(600, () => {
        outer.reveal_child = false;
        Utils.timeout(600, () => {
          box.destroy();
        });
      });
    },
  });
}

function PopupList() {
  const map: Map<number, ReturnType<typeof Animated>> = new Map();
  const box = Widget.Box({
    hpack: "end",
    spacing: 10,
    vertical: true,
    // css: options.notifications.width.bind().as(w => `min-width: ${w}px;`),
  });

  function remove(_: unknown, id: number) {
    map.get(id)?.dismiss();
    map.delete(id);
  }

  return box
    .hook(
      notifications,
      (_, id: number) => {
        if (id !== undefined) {
          if (map.has(id)) remove(null, id);

          if (notifications.dnd) return;

          const w = Animated(id);
          map.set(id, w);
          box.children = [w, ...box.children];
        }
      },
      "notified",
    )
    .hook(notifications, remove, "dismissed")
    .hook(notifications, remove, "closed");
}

export default () =>
  Widget.Window({
    name: `notifications`,
    anchor: ["top", "right"],
    layer: "overlay",
    class_name: "notifications",
    child: Widget.Box({
      css: "padding: 2px;",
      child: PopupList(),
    }),
  });
