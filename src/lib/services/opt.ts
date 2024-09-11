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

  constructor(key: string) {
    super();

    this.#key = key;
    this.#value = this.retrieve();

    _conf.connect(`changed::${key}`, this.#on_gio_changed);
  }

  retrieve(): T {
    let v = _conf.get_value(this.#key);
    return v.deepUnpack();
  }

  on_change(func: (func: T) => void, once = true) {
    _conf.connect(`changed::${this.#key}`, () => {
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

    switch (typeof value) {
      case "string":
        _conf.set_string(this.#key, value);

      case "number":
        if (Number.isInteger(value)) {
          _conf.set_int(this.#key, value);
        } else {
          _conf.set_double(this.#key, value);
        }

      case "boolean":
        _conf.set_boolean(this.#key, value);
    }
  }

  get value() {
    return this.#value;
  }

  resetValue() {
    _conf.reset(this.#key);
  }

  _bind() {
    return this.bind("value");
  }

  _as(fn) {
    return this._bind().as(fn);
  }
}

export const opt = <T>(key) => new Opt<T>(key);
