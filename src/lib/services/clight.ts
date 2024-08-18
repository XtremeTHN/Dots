import Service from "resource:///com/github/Aylur/ags/service.js"
import { subprocess, execAsync } from "resource:///com/github/Aylur/ags/utils.js"

import Gio from "gi://Gio"
// import { execAsync } from "resource:///com/github/Aylur/ags/utils/exec.js";

class CLight extends Service {
    static {
        Service.register(this,
            {
                "changed": ["int"]
            },
            {
                "alive": ["boolean", "rw"]
            }
        )
    }

    private _alive: boolean;

    constructor() {
        super()
        this._alive = false

        subprocess(["pgrep", "clight"], 
            (_) => {
                this._alive = true
            },
            (_) => {
                this._alive = false
            }
        )
    }

    get alive() {
        return this._alive;
    }

    toggle() {
        this._alive = !this._alive
        if (this._alive == false) {
            execAsync(["pkill", "clight"])
        } else {
            execAsync(["pgrep", "clight"])
                .then(_ => execAsync(["clight"]))
        }
    }
}