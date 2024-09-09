import GWeather from "gi://GWeather";
import options from "src/options.js";

const { weather } = options;

const get = (opt) => opt.value;

/**
 * This class gets weather info from lib GWeather
 */
class weatherapi extends Service {
  static {
    Service.register(
      this,
      {},
      {
        temperature: ["string", "rw"],
        "icon-name": ["string", "rw"],
        diagnostic: ["string", "rw"],
        city_name: ["string", "rw"],
        state_name: ["string", "rw"],
        location: ["gobject", "rw"],
      },
    );
  }

  #temp = "0";
  #city_name = "";
  #state_name = "";
  #icon_name = "";

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
    // this.#info.set_enabled_providers(GWeather.Provider[provider.toUpperCase()]);
    this.#info.set_enabled_providers(GWeather.Provider.METAR);
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

  #detectWeather = () => {
    let c = this.#info.get_value_conditions();
    let condition: GWeather.ConditionPhenomenon = c[1];
    let qualifier: GWeather.ConditionQualifier = c[2];

    let phen = GWeather.ConditionPhenomenon;
    let qua = GWeather.ConditionQualifier;

    let icon: string;
    let diagnostic: Array<string> = [];
    switch (condition) {
      case phen.DRIZZLE:
        icon = "weather-showers-scattered-symbolic";
        diagnostic.push("Drizzle");

      case phen.RAIN:
        icon = "weather-showers-symbolic";
        diagnostic.push("Rain");

      // i know it's wrong.
      case phen.SNOW ||
        phen.SNOW_GRAINS ||
        phen.ICE_PELLETS ||
        phen.ICE_CRYSTALS ||
        phen.HAIL ||
        phen.SMALL_HAIL:
        icon = "weather-snow-symbolic";
        diagnostic.push("Ice");

      case phen.MIST || phen.FOG || phen.VOLCANIC_ASH:
        icon = "weather-fog-symbolic";
        diagnostic.push("Fog");

      default:
        icon = "";
    }

    switch (qualifier) {
      case qua.VICINITY:
        diagnostic.push("Vicinity");

      case qua.LIGHT:
        diagnostic.push("Light");

      case qua.MODERATE:
        diagnostic.push("Moderated");

      case qua.HEAVY:
        diagnostic.push("Heavy");

      case qua.SHALLOW:
        diagnostic.push("Shallow");

      case qua.PATCHES:
        diagnostic.push("Patches");

      case qua.PARTIAL:
        diagnostic.push("Partial");

      case qua.THUNDERSTORM:
        diagnostic.push("Thunderstorm");

      case qua.BLOWING:
        diagnostic.push("Blowing");

      case qua.SHOWERS:
        diagnostic.push("Showers");

      case qua.DRIFTING:
        diagnostic.push("Drifting");

      case qua.FREEZING:
        diagnostic.push("Freezing");
    }

    if (icon !== "") {
      this.changed("icon-name");
      return;
    }

    let sky = this.#info.get_value_sky();
  };

  #update_vars = (info: GWeather.Info) => {
    console.log("updating");
    this.#translateUnit(info.get_temp());

    console.log(this.#info.get_value_conditions());

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
