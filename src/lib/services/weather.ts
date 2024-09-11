import Pixbuf from "gi://GdkPixbuf";
import { fetch } from "resource:///com/github/Aylur/ags/utils.js";
import { Response } from "resource:///com/github/Aylur/ags/utils/fetch.js";
import options from "src/options.js";

const { weather } = options;
const get = (opt) => opt.value;

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
  #pixbuf_icon;
  #location: Array<string> = ["Unknown"];

  #info = {};
  #valid_location: boolean = false;
  #manager: Freeweather | null = null;

  #interval = null;

  #name = "";
  #region = "";
  #country = "";

  constructor() {
    super();

    weather.location.on_change((loc) => {
      this.#checkLocation(loc);
      if (this.#valid_location || this.#interval == null) {
        this.#start();
      }
    });
  }

  async #getImage(url) {
    try {
      let res = await fetch(url);
      this.#pixbuf_icon = Pixbuf.Pixbuf.new_from_stream(res.stream, null);
    } catch (E) {
      console.error("Cannot fetch icon.", E);
      return;
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

    this.#interval = setInterval(() => {
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
    }, 1000);
  };

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
    this.changed("pixbuf-icon");
    this.changed("name");
    this.changed("region");
    this.changed("country");
  };

  #stop = () => {
    this.#interval.destroy();
    this.#manager = null;
  };

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
