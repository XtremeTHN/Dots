import GLib from "gi://GLib";

export const toTitle = (word: string) =>
  `${word.at(0)?.toUpperCase()}${word.slice(1)}`;

export const which = (program) =>
  Utils.exec(["bash", "-c", `which ${program} &> /dev/null; echo $status`]) !==
  "1";

export const fileExists = (file) => GLib.file_test(file, GLib.FileTest.EXISTS);
