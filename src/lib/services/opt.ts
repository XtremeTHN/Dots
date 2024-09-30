import Gio from "gi://Gio";

const _conf = Gio.Settings.new("com.github.XtremeTHN.DotFiles.ags");

export class Opt<T> extends Service {
  static {
    Service.register(
      this,
      {},
      {
        value: ["jsobject", "rw"],
      },
    );
  }

  #value;
  #key: string;
  #is_enum: boolean;
  #conf: Gio.Settings;

  constructor(conf: Gio.Settings, key: string, is_enum = false) {
    super();

    this.#key = key;
    this.#conf = conf;
    this.#value = this.retrieve();
    this.#is_enum = is_enum;

    this.#conf.connect(`changed::${key}`, this.#on_gio_changed);
  }

  retrieve(): T {
    let v = this.#conf.get_value(this.#key);
    return v.deepUnpack();
  }

  on_change(func: (func: T) => void, once = true) {
    this.#conf.connect(`changed::${this.#key}`, () => {
      func(this.retrieve());
    });
    if (once) func(this.retrieve());
  }

  #on_gio_changed = () => {
    this.emit("changed");
    this.notify("value");

    this.#value = this.retrieve();
  };

  set value(value: T) {
    this.#value = value;

    if (this.#is_enum) {
      this.#conf.set_enum(this.#key, value);
      return;
    }

    switch (typeof value) {
      case "string":
        this.#conf.set_string(this.#key, value);
        break;

      case "number":
        if (Number.isInteger(value)) {
          this.#conf.set_int(this.#key, value);
        } else {
          this.#conf.set_double(this.#key, value);
        }
        break;

      case "boolean":
        this.#conf.set_boolean(this.#key, value);
        break;
    }
  }

  get value() {
    return this.#value;
  }

  resetValue() {
    this.#conf.reset(this.#key);
  }

  _bind() {
    return this.bind("value");
  }

  _as(fn) {
    return this._bind().as(fn);
  }
}

export class Category extends Service {
  static {
    Service.register(
      this,
      {},
      {
        value: ["jsobject", "rw"],
      },
    );
  }

  #conf: Gio.Settings;

  constructor(category: string) {
    super();
    try {
      if (category == "root") {
        this.#conf = _conf;
      } else {
        this.#conf = Gio.Settings.new(
          "com.github.XtremeTHN.DotFiles.ags." + category,
        );
      }
    } catch (E) {
      console.error("Bro u got an error in category service:", E);
    }
  }

  get_category(category: string) {
    return Gio.Settings.new(category);
  }

  get_config<T>(key: string, is_enum = false) {
    return new Opt<T>(this.#conf, key, is_enum);
  }

  on_change(fn, once = false) {
    if (once) fn();
    return this.#conf.connect("changed", fn);
  }
}

// export const opt = <T>(key, is_enum = false) => new Opt<T>(key, is_enum);
