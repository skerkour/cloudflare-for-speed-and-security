export default function date(text: string, time = true) {
  const date = new Date(text);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (time) {
    options.hour = "numeric";
    options.minute = "numeric";
    options.hour12 = false;
  }
  /* @ts-ignore */
  return new Intl.DateTimeFormat("en", options).format(date)
}
