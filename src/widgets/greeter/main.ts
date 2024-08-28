import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gtk from "gi://Gtk?version=3.0";

import RoundedImage from "../custom/image.js";
import { toTitle } from "../../lib/tools.js";

const greetd = await Service.import("greetd");
const options = JSON.parse(
  Utils.readFile(`${App.configDir}/profile_config.json`),
);

type TUser = {
  name: string;
  pfp: string;
  wallpaper: string;
};

const UserLogin = (user: TUser) =>
  Widget.Overlay({
    //@ts-ignore
    child: Widget.Box({
      className: "greeter-user-login",
      vertical: true,
      children: [
        //@ts-ignore
        RoundedImage({
          image: user.wallpaper,
          className: "greeter-user-wallpaper",
        }),
        Widget.Entry({
          vpack: "center",
          className: "greeter-user-login-entry",
          placeholderText: "Password",
          onAccept: ({ text }) => {
            greetd.login(user.name, text == null ? "" : text, "Hyprland", []);
            setTimeout(() => App.Quit(), 2000);
          },
        }),
      ],
    }),
    overlays: [
      //@ts-ignore
      Widget.Box({
        vertical: true,
        vpack: "center",
        hpack: "center",
        marginTop: 20,
        children: [
          //@ts-ignore
          RoundedImage({
            image: user.pfp,
            className: "circular-image boxed-image greeter-user-pfp",
            split: true,
            index: 0,
          }),
          Widget.Label({
            className: "title-2",
            label: toTitle(user.name),
          }),
        ],
      }),
    ],
  });

const UserButton = (user: TUser, stack: Gtk.Stack) =>
  Widget.Button({
    className: "greeter-user-button",
    onClicked: () => {
      stack.set_visible_child_name(user.name);
    },
    //@ts-ignore
    child: Widget.Box({
      spacing: 15,
      children: [
        RoundedImage({
          image: user.pfp,
          className: "circular-image boxed-image",
          height: 60,
          width: 60,
        }),
        Widget.Label({
          className: "title-1",
          hpack: "center",
          hexpand: true,
          label: toTitle(user.name),
        }),
      ],
    }),
  });

const Selector = (stack: Gtk.Stack) =>
  Widget.Box({
    hpack: "center",
    vpack: "center",
    children: options.users.map((u: TUser) => UserButton(u, stack)),
  });

// main function
const stack = new Gtk.Stack();
stack.add_named(Selector(stack), "user-selector");

options.users.forEach((u) => stack.add_named(UserLogin(u), u.name));

const STYLE_PATH = `${App.configDir}`;

const Background = () =>
  Widget.Window({
    name: "back",
    anchor: ["top", "right", "bottom", "left"],
    layer: "background",
    child: Widget.Box({
      css: "background-color: #262626",
      expand: true,
    }),
  });

App.config({
  style: `${STYLE_PATH}/style.css`,
  windows: [
    Widget.Window({
      name: "greeter",
      keymode: "exclusive",
      child: stack,
    }),
    Background(),
  ],
});
