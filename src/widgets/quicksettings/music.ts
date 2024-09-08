import { MprisPlayer } from "resource:///com/github/Aylur/ags/service/mpris.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import RoundedImage from "src/widgets/custom/image.js";

import CavaWidget from "src/lib/cava";
const mpris = await Service.import("mpris");

let currentMusic = Variable<MprisPlayer | null>(null);
mpris.connect("player-added", (self, player) => {
  currentMusic.value = self.getPlayer(player);
});

export default () =>
  Widget.Overlay({
    child: currentMusic.bind("value").as((v) =>
      //@ts-ignore
      RoundedImage({
        className: "quicksettings-mpris",
        image: v?.cover_path == null ? "" : v.cover_path,
        border_radius: 16,
        width: 100,
        height: 100,
      }),
    ),
    overlays: [
      Widget.Box({
        className: "quicksettings-mpris-background",
        expand: true,
      }),
      Widget.Box({
        children: [
          Widget.Label({
            className: "title-2",
            label: currentMusic.bind("value").as((p) => p?.track_title),
            xalign: 0,
          }),
          Widget.Label({
            label: currentMusic
              .bind("value")
              .as((p) => p?.track_artists.join(", ")),
          }),
        ],
      }),
    ],
  });
