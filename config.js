import { execAsync, exec } from "resource:///com/github/Aylur/ags/utils.js";

import App from "resource:///com/github/Aylur/ags/app.js";

try {
  await execAsync([
    "bun",
    "build",
    `${App.configDir}/src/main.ts`,
    "--outdir",
    "/tmp/ags/js",
    "--external",
    "resource://*",
    "--external",
    "gi://*",
  ]);
  // @ts-ignore
  await import(`file:///tmp/ags/js/main.js`);
} catch (error) {
  console.error(error);
}
