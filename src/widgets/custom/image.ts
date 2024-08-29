import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { Opt } from "src/lib/config.js";

type RoundedImageProps = {
  image: string | Opt;
  className: string;
  split: boolean;
  index: Number;
  height: Number | null;
  width: Number | null;
};

export default ({
  image = "",
  className = "boxed-image",
  split = true,
  index = 0,
  height = null,
  width = null,
}: RoundedImageProps) => {
  if (image == "") {
    throw new Error("Bro rlly forgot to put an image here");
  }

  if (typeof image == "string") {
    return Widget.Box({
      className,
      css: `
      background-image: url("${image}");
      ${height != null ? "min-height: " + height + "px;" : ""}
      ${width != null ? "min-width: " + height + "px;" : ""}
      `,
    });
  } else {
    return Widget.Box({
      className,
    }).hook(
      image,
      (self) => {
        self.css = `
      background-image: url("${split ? image.value.split(";")[index] : image.value}");
      ${height != null ? "min-height: " + height + "px;" : ""}
      ${width != null ? "min-width: " + height + "px;" : ""}
      `;
      },
      "notify::value",
    );
  }
};
