import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gtk from "gi://Gtk?version=3.0";

import options from "src/options.js";
import { toTitle } from "src/lib/tools.js";
const greetd = Service.import("greetd");

export function getUsers() {
  const passwd = Utils.readFile("/etc/passwd").split("\n");
  let users = [];

  for (let x of passwd) {
    let splitted = x.split(":");

    // splitted[0] user name
    // splitted[2] user uuid
    // if user uuid is greeter than 1000 then this user is from a human
    // idk why is there a user named nobody
    if (Number.parseInt(splitted[2]) >= 1000 && splitted[0] !== "nobody")
      users.push(splitted[0]);
  }

  return users;
}

const UserLogin = () =>
  Widget.Box({
    className: "greeter-content",
    vertical: true,
    spacing: 30,
    children: [
      Widget.Box({
        css: options.greeter.login_image.bind("value").as(
          (p) => `
          background-image: url("${p}");
          background-size: cover;
          background-position: center;
          min-height: 200px;

          border-top-right-radius: 16px;
          border-top-left-radius: 16px;

        `,
        ),
      }),
      Widget.Box({
        className: "greeter-content-entry",
        marginTop: 10,
        marginStart: 10,
        marginEnd: 10,
        hexpand: true,
        spacing: 5,
        children: [
          Widget.Icon({
            icon: "system-lock-screen-symbolic",
          }),
          Widget.Entry({
            hexpand: true,
            placeholderText: "Password",
          }),
        ],
      }),
    ],
  });

const UserLoginOverlay = (user) =>
  Widget.Overlay({
    child: UserLogin(),
    overlays: [
      Widget.Box({
        marginBottom: 70,
        vertical: true,
        vpack: "end",
        hpack: "center",
        children: [
          Widget.Box({
            className: "circular",
            css: user.pfp.bind("value").as(
              (p) => `
              background-image: url("${p}");
              background-size: cover;
              background-position: center;

              min-height: 120px;
              min-width: 120px;
            `,
            ),
          }),
          Widget.Label({
            className: "title-2",
            label: toTitle(user.name),
          }),
        ],
      }),
    ],
  });

const UserRow = (user, stack) =>
  Widget.Button({
    className: "greeter-user-row",
    onClicked: () => {
      stack.add_named(UserLoginOverlay(user), `${user.name}-login`);
      // stack.shown = `${user.name}-login`;
      stack.set_visible_child_name(`${user.name}-login`);
    },
    child: Widget.Box({
      children: [
        Widget.Icon({
          icon: user.pfp.bind("value"),
          size: 16,
        }),
        Widget.Label({
          label: user.name,
          hpack: "center",
        }),
      ],
    }),
  });

const UserSelection = (stack) =>
  Widget.Box({
    children: options.greeter.users.map((u) => UserRow(u, stack)),
  });

export default () =>
  Widget.Window({
    name: "greeter",
    child: Widget.Stack({
      setup: (self) => {
        self.children = {
          selection: UserSelection(self),
        };
      },
    }),
  });
