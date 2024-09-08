import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gtk from "gi://Gtk?version=3.0";

import RoundedImage from "../custom/image.js";
import { toTitle } from "../../lib/tools.js";

import TopBar from "./topbar.js";
import { CornerTopleft, CornerTopright } from "../corners/index.js";

const greetd = await Service.import("greetd");
const options = JSON.parse(
  Utils.readFile(`${App.configDir}/profile_config.json`),
);

// function getUsers() {
//   const passwd = Utils.readFile("/etc/passwd").split("\n");
//   let users: Array<string> = [];

//   for (let x of passwd) {
//     let splitted = x.split(":");

//     // splitted[0] user name
//     // splitted[2] user uuid
//     // if user uuid is greeter than 1000 then this user is from a human
//     // idk why is there a user named nobody
//     if (Number.parseInt(splitted[2]) >= 1000 && splitted[0] !== "nobody")
//       users.push(splitted[0]);
//   }

//   return users;
// }

type TUser = {
  name: string;
  pfp: string;
  wallpaper: string;
};

const UserLogin = (user: TUser, stack: Gtk.Stack) =>
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
        Widget.Box({
          vpack: "center",
          className: "greeter-user-login-data",
          hexpand: true,
          vertical: true,
          spacing: 10,
          children: [
            Widget.Entry({
              placeholderText: "Password",
              visibility: false,
              hexpand: true,
              onAccept: ({ text }) => {
                greetd.login(
                  user.name,
                  text == null ? "" : text,
                  "Hyprland",
                  [],
                );
                setTimeout(() => App.Quit(), 2000);
              },
            }),
            Widget.Button({
              onClicked: () => stack.set_visible_child_name("user-selector"),
              child: Widget.Label("Go back"),
              hexpand: true,
            }),
          ],
        }),
      ],
    }),
    overlays: [
      //@ts-ignore
      Widget.Box({
        vertical: true,
        vpack: "center",
        hpack: "center",
        marginBottom: 20,
        children: [
          //@ts-ignore
          RoundedImage({
            image: user.pfp,
            height: 120,
            width: 120,
            border_radius: 9999,
            className: "boxed-image",
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
          border_radius: 9999,
          className: "boxed-image",
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
stack.set_transition_type(Gtk.StackTransitionType.CROSSFADE);
stack.set_transition_duration(300);

options.users.forEach((u) => stack.add_named(UserLogin(u, stack), u.name));

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
      keymode: "on-demand",
      child: stack,
    }),
    CornerTopleft(),
    CornerTopright(),
    TopBar(),
    Background(),
  ],
});
