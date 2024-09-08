import GWeather from "gi://GWeather";

// const location = GWeather.Location.new_detached(
// PERSONAL DATA xd
// );
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

class weatherapi extends Service {
  static {
    Service.register(this, {});
  }
}
