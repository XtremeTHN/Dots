import Gio from "gi://Gio";

export interface CLight extends Gio.DBusProxy {
    new(...args: unknown[]): Gio.DBusProxy

    AcState: number
    AmbientBr: number
    BIPct: number
    ClightVersion: String
    DayTime: number
    DisplayState: number
    InEvent: boolean
    Inhibited: boolean
    KbdPct: number
    LidState: number
    Location: [number, number]
    NextEvent: number
    Prminhibited: boolean
    ScreenBr: number
    SensorAvail: boolean
    Sunrise: number
    Sunset: number
    Suspended: boolean
    Temp: number
    Version: string

    Capture: (reset_backlight_timer: boolean, change_backlight_on_capture: boolean) => void
    DecBI: (pct: number) => void
    IncBI: (pct: number) => void
    Inhibit: (inhibit: boolean) => void
    Load: (module_path: string) => void
    Pause: (pause: boolean) => void
    Unload: (module_path: string) => void
}

export interface CLightConf extends Gio.DBusProxy {
    new(...args: unknown[]): Gio.DBusProxy

    ResumeDelay: number
    Verbose: boolean

    Store: () => void
}