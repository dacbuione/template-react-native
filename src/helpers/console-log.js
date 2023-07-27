import { crashLog } from "./crashlytics";

var orig = console.log;

console.log = function log() {
  // tracking on Firebase
  let stringify = arguments;
  try {
    stringify = JSON.stringify(arguments);
  } catch {}
  crashLog(
    `[${new Date().toISOString().replace("T", " ").replace(/\..+/, "")}] ` +
      stringify
  );
  // if (__DEV__) {
  orig.apply(console, [...arguments]);
  // }
};
