import deepClone from "./deepclone";

// declare namespace deepClone {
//   interface Options {
//     proto?: boolean;
//     circles?: boolean;
//   }
// }

declare function deepClone<T>(input: T): T;

export = deepClone;
