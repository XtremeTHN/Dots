import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { type Opt } from "src/lib/config.js";
import Gtk from "gi://Gtk?version=3.0";

import { toTitle } from "src/lib/tools.js";

import options from "src/options.js";
const greetd = await Service.import("greetd");

type TUser = {
  name: string;
  profile_images: Opt;
};

const RoundedImage = (image) => {
  if (typeof image == "string") {
    Widget.Box({
      css: `
      background-image: url("${user.profile_images.value.split(";")[0]}");
      background-size: cover;
      background-position: center;
      `,
    });
  }
};

export function getUsers() {
  const passwd = Utils.readFile("/etc/passwd").split("\n");
  let users: Array<string> = [];

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

const stack = new Gtk.Stack();

const UserLogin = (user: TUser) =>
  Widget.Overlay({
    child: Widget.Box({
      className: "greeter-user-login",
      vertical: true,
      children: [
        Widget.Box({
          className: "greeter-user-wallpaper",
        }).hook(
          user.profile_images,
          (self) => {
            self.css = `
            background-image: url("${user.profile_images.value.split(";")[1]}");
          `;
          },
          "notify::value",
        ),
        Widget.Entry({
          vpack: "center",
          className: "greeter-user-login-entry",
          placeholderText: "Password",
          onAccept: ({ text }) => {
            greetd.login(user.name, text == null ? "" : text, "Hyprland", []);
          },
        }),
      ],
    }),
    overlays: [
      Widget.Box({
        vertical: true,
        vpack: "center",
        hpack: "center",
        marginTop: 20,
        children: [
          Widget.Box({
            className: "circular",
          }).hook(user.profile_images, (self) => {
            self.css = `
              background-image: url("${user.profile_images.value.split(";")[0]}");
              background-size: cover;
              background-position: center;

              min-height: 120px;
              min-width: 120px;
            `;
          }),
          Widget.Label({
            className: "title-2",
            label: toTitle(user.name),
          }),
        ],
      }),
    ],
  });

options.greeter.users.forEach((u) => stack.add_named(UserLogin(u), u.name));

const UserButton = (user: TUser) =>
  Widget.Button({
    onClicked: () => {
      stack.set_visible_child_name(user.name);
    },
    child: Widget.Box({
      spacing: 15,
      children: [
        Widget.Icon({
          className: "circular",
          icon: user.profile_images._as((i) => i.split(";")[0]),
          size: 64,
        }),
        Widget.Label({
          hpack: "center",
          label: user.name,
        }),
      ],
    }),
  });

const Selector = () =>
  Widget.Box({
    hpack: "center",
    vpack: "center",
    children: options.greeter.users.map((u: TUser) => UserButton(u)),
  });

stack.add_named(Selector(), "user-selector");

export default () =>
  Widget.Window({
    name: "greeter",
    child: stack,
  });
