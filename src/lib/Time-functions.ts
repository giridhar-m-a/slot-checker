/**
 * Helper function to convert time string to minutes
 *
 * @param time - time string in 'HH:MM' format, e.g. "12:30"
 * @returns  minute value, e.g. 750
 */
const timeToMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number); // split the string into hour and minute numbers

  return hour * 60 + minute; // convert the time to minutes
};

/**
 * Converts a given number of minutes into a time string in "HH:MM" format.
 * Ensures that both hours and minutes are zero-padded if less than 10.
 *
 * @param minutes - The total number of minutes to convert.
 * @returns A string representing the time in "HH:MM" format.
 */
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

export { minutesToTime, timeToMinutes };
