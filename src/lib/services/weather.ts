import Pixbuf from "gi://GdkPixbuf";
import Gio from "gi://Gio";
import GLib from "gi://GLib";
import { fetch } from "resource:///com/github/Aylur/ags/utils.js";
import { Response } from "resource:///com/github/Aylur/ags/utils/fetch.js";

import Widget from "resource:///com/github/Aylur/ags/widget.js";
import options from "src/options.js";

const { weather } = options;

const get = (opt) => opt.value;

Gio._promisify(Gio.File.prototype, "load_contents_async");

const FREEWEATHER_URL = "https://api.weatherapi.com/v1/current.json?key=";

const insertAtStart = (char, string) => {
  let first = string.slice(0, 1);
  return char + first + string.slice(1);
};

class Freeweather {
  constructor() {}

  async send_request(params: Array<string>) {
    let final = FREEWEATHER_URL + get(weather.api_key);
    let first = insertAtStart("&", params.at(0));
    params[0] = first;

    return fetch(final + params.join("&"));
  }
}

const getWebFile = async (url: string): Promise<Uint8Array> => {
  let res = Gio.File.new_for_uri(url);

  let splitted = url.split("/");
  const path = `${App.configDir}/resources/${splitted.at(-2)}_${splitted.at(-1)}`;

  const [content, _] = await res.load_contents_async(null);
  let dest = Gio.File.new_for_path(path);
  dest.replace_contents_async(
    content,
    _,
    false,
    Gio.FileCreateFlags.REPLACE_DESTINATION,
    null,
    () => {},
  );
  return new Promise((res) => {
    res(content);
  });
};

const pixbuf_from_bytes = (b: Uint8Array) => {
  const stream = Gio.MemoryInputStream.new_from_bytes(new GLib.Bytes(b));
  return Pixbuf.Pixbuf.new_from_stream(stream, null);
};

/**
 * A weather service.
 */
class weatherapi extends Service {
  static {
    Service.register(
      this,
      {},
      {
        temperature: ["float", "rw"],
        condition: ["string", "rw"],
        location: ["jsobject", "rw"],
        "pixbuf-icon": ["gobject", "rw"],

        name: ["string", "rw"],
        region: ["string", "rw"],
        country: ["string", "rw"],
      },
    );
  }

  #temp = "0";
  #condition = "No data";
  #pixbuf_icon: Pixbuf.Pixbuf | null = null;
  #location: Array<string> = ["Unknown"];

  #info = {};
  #valid_location: boolean = false;
  #manager: Freeweather | null = null;

  #name = "";
  #region = "";
  #country = "";

  constructor() {
    super();

    weather.location.on_change((loc) => {
      this.#checkLocation(loc);
      if (this.#valid_location || get(weather.api_key) !== "") {
        this.#start();
      }
    });
  }

  async #getImage(url: string) {
    try {
      const content = await getWebFile(url);
      this.#pixbuf_icon = pixbuf_from_bytes(content).scale_simple(
        42,
        42,
        Pixbuf.InterpType.BILINEAR,
      );
      this.changed("pixbuf-icon");
    } catch (E) {
      console.error(E);
    }
  }

  #checkLocation(loc) {
    if (this.#location[0] == "coords") {
      if (this.#location.length < 3) {
        console.error("Location array incomplete");
        this.#valid_location = false;

        return;
      }
    }
    if (this.#location[1] == "Unkown" || this.#location[1] == "") {
      console.error("Location second item is empty");
      this.#valid_location = false;
      return;
    }

    this.#valid_location = true;
    this.#location = loc;
    this.changed("location");
  }

  #start = () => {
    switch (get(weather.provider)) {
      case "freeweather":
        this.#manager = new Freeweather();
        break;
    }

    // this.#interval = setInterval(
    //   this.#req.bind(this),
    //   get(weather.update_time),
    // );
    this.#req();
  };

  #req() {
    let query = "";

    switch (get(weather.location_type)) {
      case "coordinates":
        if (this.#location.length < 2) {
          console.error(
            "Location length is not 2. If you updated location-type, you should update location too.",
          );
          return;
        }
        query = this.#location.join(",");
        break;
      case "name":
        query = this.#location[1];
        break;
    }

    this.#manager
      ?.send_request([`q=${query}`, "aqi=no"])
      .then(this.#updateVars.bind(this))
      .catch(console.error);
  }

  #updateVars(result: Response) {
    result
      .json()
      .then((r) => {
        switch (get(weather.temp_unit)) {
          case "centigrade":
            this.#temp = r.current.temp_c;
            break;
          case "fahrenheit":
            this.#temp = r.current.temp_f;
            break;
        }

        this.#name = r.location.name;
        this.#region = r.location.region;
        this.#country = r.location.country;
        this.#condition = r.current.condition.text;
        this.#getImage("https://" + r.current.condition.icon.slice(2));

        this.#notify_all();
      })
      .catch(console.error);
  }

  #notify_all = () => {
    this.changed("temperature");
    this.changed("condition");
    this.changed("name");
    this.changed("region");
    this.changed("country");
  };

  /**
  * Connects to a widget and updates the weather service when the widget is visible.
  Returns the widget.
  */
  attach<T>(window): T {
    return window.on("notify::visible", () => {
      if (window.visible == true) {
        console.debug("Sending request to", get(weather.provider), "provider");
        this.#req();
      }
    });
  }

  get temperature() {
    return this.#temp;
  }

  get condition() {
    return this.#condition;
  }

  get location() {
    return this.#location;
  }

  get pixbuf_icon() {
    return this.#pixbuf_icon;
  }

  get name() {
    return this.#name;
  }

  get region() {
    return this.#region;
  }

  get country() {
    return this.#country;
  }
}

const Weather = new weatherapi();

export default Weather;
