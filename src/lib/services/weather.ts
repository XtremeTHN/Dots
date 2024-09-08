import GWeather from "gi://GWeather";
import Geoclue from "gi://Geoclue";

// import options from "src/options";

// let location = GWeather.Location.new_detached(
//   "Guadalupe",
//   null,
//   25.67678,
//   -100.25646,
// );

// const get_level = (loc: GWeather.Location, level: GWeather.LocationLevel) => {
//   let l = loc.get_level();
//   let location = loc;

//   if (l < level) {
//     location.find_nearest_city(25.58333, -99.75);
//   } else if (l > level) {
//     let le = l;
//     while (le > level) {
//       location = location.get_parent();
//       le = location.get_level();
//     }
//   }

//   return location;
// };

// const getCity = (loc) => get_level(loc, GWeather.LocationLevel.CITY);
// const getState = (loc) => get_level(loc, GWeather.LocationLevel.ADM1);

// let state = getState(location).get_name();
// let city = getCity(location).get_name();

// console.log(city, state);

// let city_obj = getCity(location);

// console.log("asd", location.get_parent()?.get_parent()?.get_name());

// console.log(city, state);

// const info = new GWeather.Info({
//   applicationId: "com.github.Aylur.ags",
//   contactInfo: "xtreme.dev2@gmail.com",
//   enabledProviders: GWeather.Provider.MET_NO,
//   location,
// });

// info.connect("updated", () => {
//   let farenheit = info.get_temp().replaceAll("°F", "").trim();
//   console.log(
//     `${Math.floor((Number.parseFloat(farenheit) - 32) * 0.555556)} °C`,
//   );
// });

// info.update();
// console.log("updating");

const get_location_geoclue = () => {
  let simple = Geoclue.Simple.new;
};

// class weatherapi extends Service {
//   static {
//     Service.register(
//       this,
//       {},
//       {
//         temperature: ["float", "rw"],
//         city_name: ["string", "rw"],
//         state_name: ["string", "rw"],
//         location: ["gobject", "rw"],
//       },
//     );
//   }

//   constructor() {
//     super();

//     if (options.location.lat.value == 0 && options.location.long.value == 0) {
//       console.debug("Using geolocation");
//     }
//   }
// }
