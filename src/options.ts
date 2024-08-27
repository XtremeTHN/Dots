import { opt } from "./lib/config.js";
import { getUsers } from "./widgets/greeter/index.js";

export default {
  wallpaper: opt("wallpaper"),
  greeter: {
    login_image: opt("greeter-login-image"),
    users: getUsers().map((u) => {
      return {
        name: u,
        profile_images: opt(`${u}-greeter-images`),
      };
    }),
  },
};
