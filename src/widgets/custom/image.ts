import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { Box } from "resource:///com/github/Aylur/ags/widgets/box.js";
import { Opt } from "src/lib/config.js";

import Gtk from "gi://Gtk?version=3.0";

type RoundedImageProps = {
  image: string | Opt;
  className: string;
  split: boolean;
  index: Number;
  border_radius: Number;
  height: Number | null;
  width: Number | null;
};

export default ({
  image = "",
  className = "boxed-image",
  split = true,
  index = 0,
  border_radius = 0,
  height = null,
  width = null,
}: RoundedImageProps) => {
  if (image == "") {
    throw new Error("Bro rlly forgot to put an image here");
  }

  if (typeof image == "string") {
    return Object.assign(
      Widget.Box({
        css: `
        background-image: url("${image}");
        ${height != null ? "min-height: " + height + "px;" : ""}
        ${width != null ? "min-width: " + height + "px;" : ""}
        border-radius: ${border_radius}px;
      `,
        className,
      }),
      {
        setImage: (self) => {
          self.css = `
          background-image: url("${image}");
        `;
        },
      },
    );
  } else {
    return Object.assign(
      Widget.Box({
        css: `
        ${height != null ? "min-height: " + height + "px;" : ""}
        ${width != null ? "min-width: " + height + "px;" : ""}
        border-radius: ${border_radius}px;
      `,
        className,
      }).hook(
        image,
        (self) => {
          self.css = `
          background-image: url("${split ? image.value.split(";")[index] : image.value}");
        `;
        },
        "notify::value",
      ),
      {
        setImage: (self) => {
          self.css = `
          background-image: url("${split ? image.value.split(";")[index] : image.value}");
        `;
        },
      },
    );
  }
};
