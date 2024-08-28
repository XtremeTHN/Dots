import { opt } from "./lib/config.js";
function getUsers() {
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

export default {
  wallpaper: opt("wallpaper"),
};
