import { format, parse } from "date-fns";

/**
 * Helper function to convert 'DD/MM/YYYY' string to Date object using date-fns
 *
 * This function takes a string in the format 'DD/MM/YYYY' and returns the corresponding Date object.
 * It assumes the input string is a valid date in the specified format.
 *
 * @param dateStr - 'DD/MM/YYYY' string to be parsed
 * @returns Date object representing the parsed date
 */
const parseDate = (dateStr: string): Date => {
  return parse(dateStr, "dd/MM/yyyy", new Date());
};

/**
 * Helper function to convert Date object to 'DD/MM/YYYY' string format using date-fns
 *
 * This function takes a Date object and returns a string in the format 'DD/MM/YYYY',
 * e.g. "01/01/2023".
 *
 * @param date - Date object to be formatted
 * @returns - 'DD/MM/YYYY' string
 */
const formatDate = (date: Date): string => {
  return format(date, "dd/MM/yyyy");
};

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
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  // Return the formatted time string with zero-padded hours and minutes.
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

/**
 * Converts a given time string in "HH:MM" format to a Date object
 *
 * @param baseDate - The date to use as the base for the new Date object.
 * @param time - The time string in "HH:MM" format.
 * @returns A Date object representing the given time on the given base date.
 */
const parseTime = (baseDate: Date, time: string): Date => {
  const [hours, minutes] = time.split(":").map(Number); // split the string into hour and minute numbers
  const result = new Date(baseDate); // create a new Date object based on the base date
  result.setHours(hours, minutes, 0, 0); // set the hours, minutes, seconds, and milliseconds of the result
  return result;
};

export { formatDate, minutesToTime, parseDate, timeToMinutes, parseTime };
