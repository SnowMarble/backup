export const random = (length: number): number =>
  +Math.floor(Math.random() * 10 ** length)
    .toString()
    .padEnd(length, "0");
