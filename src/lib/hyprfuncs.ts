import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";

export const Workspaces = () => Widget.Box({
    class_name: 'topbar-workspaces',
    spacing: 5,
    children: Array.from({ length: 5 }, (_, i) => i + 1).map(i => Widget.EventBox({
      setup: btn => {
        // @ts-ignore
        btn.id = i
      },
      child: Widget.Box({
        class_name: "topbar-workspaces-button-circle",
      })
    }))
  }).hook(Hyprland, self => self.children.forEach(btn => {
    const workspaces = Hyprland.workspaces;
    const current_ws = Hyprland.active.workspace.id;
    // @ts-ignore
    btn.visible = workspaces.some(ws => ws.id === btn.id);
    // @ts-ignore
    btn.child.toggleClassName('active', current_ws === btn.id);
  }))
