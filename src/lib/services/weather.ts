import GWeather from "gi://GWeather";
import options from "src/options.js";

const { weather } = options;

const get = (opt) => opt.value;

class weatherapi extends Service {
  static {
    Service.register(
      this,
      {},
      {
        temperature: ["string", "rw"],
        city_name: ["string", "rw"],
        state_name: ["string", "rw"],
        location: ["gobject", "rw"],
      },
    );
  }

  #temp = "0";
  #city_name = "";
  #state_name = "";

  #location: GWeather.Location | null = null;
  #info = new GWeather.Info({
    applicationId: "com.github.Aylur.ags",
    contactInfo: "xtreme.dev2@gmail.com",
  });

  #interval;
  #update_connection_id = 0;

  constructor() {
    super();
    console.log("constructed");
    weather.location.lat.on_change(this.#checkCoords);
    weather.location.lon.on_change(this.#checkCoords);

    weather.provider.on_change(this.#change_provider, true);
  }

  #change_provider = (provider: string) => {
    console.log("changed providers", provider);
    this.#info.set_enabled_providers(GWeather.Provider[provider.toUpperCase()]);
  };

  #getCityAndState = () => {
    let state = this.#location.get_parent();
    while (state && state.get_level() > GWeather.LocationLevel.ADM1)
      state = state.get_parent();

    if (state) return [this.#location.get_name(), state.get_name()];
    else return [this.#location.get_name()];
  };

  #get_location = () => {
    console.log("getting location");
    this.#location = GWeather.Location.new_detached(
      get(weather.location.city_name),
      null,
      get(weather.location.lat),
      get(weather.location.lon),
    );

    this.#info.set_location(this.#location);
  };

  #start = () => {
    console.log("starting");
    this.#interval = setInterval(() => {
      this.#info.update();
    }, 4000);

    this.#update_connection_id = this.#info.connect(
      "updated",
      this.#update_vars,
    );
  };

  #stop = () => {
    console.log("stopping");
    this.#interval?.destroy();
    if (this.#update_connection_id > 0)
      this.#info.disconnect(this.#update_connection_id);
  };

  #translateUnit = (unit: string) => {
    console.log("translating");
    switch (get(weather.temp_unit)) {
      case "fahrenheit":
        this.#temp = unit;
        this.changed("temperature");
      case "centigrade":
        let farenheit = unit.replaceAll("°F", "").trim();
        this.#temp = `${Math.floor((Number.parseFloat(farenheit) - 32) * 0.555556)} °C`;
        this.changed("temperature");
    }
  };

  #update_vars = (info: GWeather.Info) => {
    console.log("updating");
    this.#translateUnit(info.get_temp());

    let d = this.#getCityAndState();
    this.#city_name = d[0];
    this.#state_name = d.at(1) !== null ? d.at(1) : "";

    this.changed("city_name");
    this.changed("state_name");
  };

  #checkCoords = () => {
    console.log("checking coords");
    if (
      get(weather.location.lat) == 0 &&
      get(weather.location.lon) == 0 &&
      get(weather.location.city_name) == ""
    ) {
      console.error(
        "Cannot initialize weather service. Provide a latitude, longitude and city values in control center.",
      );

      this.#stop();
    } else {
      this.#stop();
      this.#get_location();
      this.#start();
    }
  };

  get temperature() {
    return this.#temp;
  }

  get state_name() {
    return this.#state_name;
  }

  get city_name() {
    return this.#city_name;
  }
}

const Weather = new weatherapi();

export default Weather;
