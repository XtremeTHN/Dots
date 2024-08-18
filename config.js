import { execAsync } from "resource:///com/github/Aylur/ags/utils/exec.js";
import App from "resource:///com/github/Aylur/ags/app.js";

const STYLE_PATH = `${App.configDir}/src/styles`
execAsync(["sass", `${STYLE_PATH}/main.scss`, `${STYLE_PATH}/style.css`])
    .then(() => App.applyCss(`${STYLE_PATH}/style.css`))
    .catch(console.error)

try {
    await execAsync([
        'bun', 'build', `${App.configDir}/src/main.ts`,
        '--outdir', '/tmp/ags/js',
        '--external', 'resource://*',
        '--external', 'gi://*',
    ])
    // @ts-ignore
    await import(`file:///tmp/ags/js/main.js`)
} catch (error) {
    console.error(error)
}
