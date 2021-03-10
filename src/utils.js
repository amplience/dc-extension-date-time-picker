export function pad(num) {
  return String(num).padStart(2, '0');
}

export function offsetMinutesToString(num) {
  let negative = num < 0;
  num = Math.abs(num);
  let hours = pad(Math.trunc(num / 60));
  let minutes = pad(num % 60);
  return `${negative ? '-' : '+'}${hours}:${minutes}`;
}
