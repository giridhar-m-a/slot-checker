"use server";

import { AvailableSlot } from "@/app/__types/available-slot.type";
import {
  FullAvailability,
  Participants,
  Schedules,
  SlotsOutput,
  TimeRange,
  UserSlot,
} from "@/app/__types/participants.type";
import { AvailabilityFormInput } from "@/app/participant/availability/schemas/AvailabilityForm.schema";
import {
  getParticipantAvailability,
  getParticipants,
  getSchedules,
} from "@/lib/get-redis-data";
import { minutesToTime, timeToMinutes } from "@/lib/Time-functions";
import { eachDayOfInterval, format, parse } from "date-fns";

/**
 * Finds the available slots for a given set of participants and date range.
 *
 * @param {Object} data - An object containing the IDs of the participants and the date range.
 * @param {string[]} data.participants - An array of strings representing the IDs of the participants.
 * @param {Object} data.date_range - An object containing the start and end dates of the desired range.
 * @param {Date} data.date_range.start - The start date of the desired range.
 * @param {Date} data.date_range.end - The end date of the desired range.
 *
 * @returns {Promise<AvailableSlot>} - An object where the keys are the dates in the range and the values are arrays of available slots for those dates.
 */
export const checkParticipantAvailableSlots = async (
  data: AvailabilityFormInput
) => {
  const participantIds: number[] = data.participants.map((participant) =>
    Number(participant)
  );
  try {
    const participants = getParticipantsByIds(
      participantIds,
      await getParticipants()
    );
    const participantAvailability = getAvailabilityByIds(
      participantIds,
      await getParticipantAvailability()
    );
    const schedules = getSchedulesByIds(participantIds, await getSchedules());
    const userSlots = createUserSlots(participants, participantAvailability);
    const result = findAvailableSlots(userSlots, schedules, data.date_range);
    return result;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Creates an object where the keys are the days of the week and the values are
 * arrays of available time slots of 30 minutes each, up to a maximum of the
 * given threshold.
 *
 * @param {number} threshold - The maximum number of time slots to create.
 * @param {Object<string,TimeRange[]>} availability - An object where the keys
 * are the days of the week and the values are arrays of time ranges.
 *
 * @returns {SlotsOutput} - An object where the keys are the days of the week and
 * the values are arrays of available time slots of 30 minutes each, up to a
 * maximum of the given threshold.
 */
function createTimeSlots(
  threshold: number,
  availability: { [day: string]: TimeRange[] }
): SlotsOutput {
  const output: SlotsOutput = {};
  for (const day in availability) {
    const ranges = availability[day];
    const slots: TimeRange[] = [];
    for (const range of ranges) {
      let startMinutes = timeToMinutes(range.start);
      const endMinutes = timeToMinutes(range.end);
      while (startMinutes + 30 <= endMinutes && slots.length < threshold) {
        const slotEnd = startMinutes + 30;
        slots.push({
          start: minutesToTime(startMinutes),
          end: minutesToTime(slotEnd),
        });
        startMinutes = slotEnd;
      }
      if (slots.length > threshold) break;
    }
    output[day.toLowerCase()] = slots;
  }
  return output;
}

/**
 * Creates an array of UserSlot objects for each participant based on their
 * availability and threshold.
 *
 * @param {Participants} participants - An object containing participant IDs
 * and their details.
 * @param {FullAvailability} fullAvailability - An object where keys are
 * participant IDs and values are their weekly availabilities.
 *
 * @returns {UserSlot[]} - An array of UserSlot objects, each containing the
 * participant ID and an array of available time slots.
 */
function createUserSlots(
  participants: Participants,
  fullAvailability: FullAvailability
): UserSlot[] {
  const userSlots: UserSlot[] = [];
  for (const id in participants) {
    const participantId = parseInt(id, 10);
    const participant = participants[participantId];
    const availability = fullAvailability[participantId];
    if (participant && availability) {
      const slots = createTimeSlots(participant.threshold, availability);
      userSlots.push({ id: participantId, slots });
    }
  }
  return userSlots;
}

/**
 * Returns a new Participants object containing only the participants
 * with the IDs provided in `participantIds`.
 *
 * @param {number[]} participantIds - An array of participant IDs to filter
 * by.
 * @param {Participants} participants - An object where keys are participant
 * IDs and values are their details.
 *
 * @returns {Participants} - A new object containing the filtered participants.
 */
function getParticipantsByIds(
  participantIds: number[],
  participants: Participants
): Participants {
  const filteredParticipants: Participants = {};

  for (const id of participantIds) {
    if (participants[id]) {
      filteredParticipants[id] = participants[id];
    }
  }
  return filteredParticipants;
}

/**
 * Filters the availability data to include only the entries for the specified participant IDs.
 *
 * @param {number[]} ids - An array of participant IDs to filter by.
 * @param {FullAvailability} availability - An object where keys are participant IDs
 * and values are their weekly availabilities.
 *
 * @returns {FullAvailability} - A new object containing the filtered availability data
 * for the specified participant IDs.
 */
function getAvailabilityByIds(
  ids: number[],
  availability: FullAvailability
): FullAvailability {
  const filteredAvailability: FullAvailability = {};

  for (const id of ids) {
    if (availability[id]) {
      filteredAvailability[id] = availability[id];
    }
  }

  return filteredAvailability;
}

/**
 * Filters the schedule data to include only the entries for the specified participant IDs.
 *
 * @param {number[]} ids - An array of participant IDs to filter by.
 * @param {Schedules} schedules - An object where keys are participant IDs
 * and values are their schedules.
 *
 * @returns {Schedules} - A new object containing the filtered schedule data
 * for the specified participant IDs.
 */
function getSchedulesByIds(ids: number[], schedules: Schedules): Schedules {
  const filteredSchedules: Schedules = {};

  for (const id of ids) {
    if (schedules[id]) {
      filteredSchedules[id] = schedules[id];
    }
  }

  return filteredSchedules;
}

/**
 * Identifies common time slots available across multiple users.
 *
 * @param {UserSlot[]} userSlots - An array of UserSlot objects, each containing
 * the participant ID and an array of available time slots for each day.
 *
 * @returns {SlotsOutput} - An object where the keys are the days of the week and
 * the values are arrays of time slots that are common across all users.
 */
function findCommonSlots(userSlots: UserSlot[]): SlotsOutput {
  const commonSlots: SlotsOutput = {};

  const allDays = Array.from(
    new Set(userSlots.flatMap((user) => Object.keys(user.slots)))
  );

  allDays.forEach((day) => {
    const daySlots: TimeRange[][] = userSlots
      .map((user) => user.slots[day] || [])
      .filter((slots) => slots.length > 0);

    if (daySlots.length === 0) return;

    const commonDaySlots = daySlots.reduce((common, userDaySlots) => {
      return common.filter((slot) =>
        userDaySlots.some(
          (userSlot) =>
            userSlot.start === slot.start && userSlot.end === slot.end
        )
      );
    });

    if (commonDaySlots.length > 0) {
      commonSlots[day] = commonDaySlots;
    }
  });

  return commonSlots;
}

/**
 * Determines the available time slots for participants within a specified date range.
 *
 * @param {UserSlot[]} slots - An array of UserSlot objects, each containing participant IDs
 * and their respective available time slots for each day.
 * @param {Schedules} schedules - An object where keys are participant IDs, and values are
 * their scheduled time ranges for specific dates.
 * @param {AvailabilityFormInput["date_range"]} dateRange - An object containing the start
 * and end dates to define the desired date range for finding available slots.
 *
 * @returns {AvailableSlot} - An object where keys are dates in the specified range (formatted as "dd/MM/yyyy")
 * and values are arrays of available time slots for those dates. The available slots are
 * determined based on common slots across participants and considering any scheduled time
 * ranges that should be excluded.
 */
function findAvailableSlots(
  slots: UserSlot[],
  schedules: Schedules,
  dateRange: AvailabilityFormInput["date_range"]
): AvailableSlot {
  const availableSlots: AvailableSlot = {};

  const datesInRange = eachDayOfInterval({
    start: dateRange.start,
    end: dateRange.end,
  });

  datesInRange.forEach((date) => {
    const formattedDate = format(date, "dd/MM/yyyy");
    availableSlots[formattedDate] = [];
  });
  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);
  const isScheduled = (date: string) => {
    let hasSchedule = false;

    for (const userId in schedules) {
      const userSchedules = schedules[userId];
      if (userSchedules[date] && userSchedules[date].length > 0) {
        hasSchedule = true;
        break;
      }
    }
    return hasSchedule;
  };
  const commonSlots = findCommonSlots(slots);
  Object.keys(availableSlots).forEach((key) => {
    const parsedDate = parse(key, "dd/MM/yyyy", new Date());
    const day = format(parsedDate, "EEEE").toLowerCase();
    if (!isScheduled(key)) {
      availableSlots[key] = commonSlots[day]?.map(
        (slot) => `${slot.start} - ${slot.end}`
      );
    } else {
      availableSlots[key] = getNonOverlappingSlots(schedules, commonSlots[day]);
    }
  });

  return availableSlots;
}

/**
 * Checks if two time slots overlap.
 *
 * @param {TimeRange} slot1 - The first time slot with start and end times.
 * @param {TimeRange} slot2 - The second time slot with start and end times.
 * @returns {boolean} - Returns true if the time slots overlap; otherwise, false.
 */
function isOverlapping(slot1: TimeRange, slot2: TimeRange): boolean {
  const start1 = new Date(`1970-01-01T${slot1.start}:00Z`).getTime();
  const end1 = new Date(`1970-01-01T${slot1.end}:00Z`).getTime();
  const start2 = new Date(`1970-01-01T${slot2.start}:00Z`).getTime();
  const end2 = new Date(`1970-01-01T${slot2.end}:00Z`).getTime();

  return start1 < end2 && start2 < end1;
}

/**
 * Gets the non-overlapping time slots from the given common slots and schedules.
 *
 * @param {Object.<number, Object.<string, TimeRange[]>>} schedules - The schedules of each participant.
 * @param {TimeRange[]} commonSlots - The common time slots.
 * @returns {string[]} - An array of available time slots in the format "HH:mm - HH:mm".
 */
function getNonOverlappingSlots(
  schedules: { [participantId: number]: { [date: string]: TimeRange[] } },
  commonSlots: TimeRange[]
): string[] {
  const availableSlots: string[] = [];

  for (const commonSlot of commonSlots) {
    let overlaps = false;

    for (const participantId in schedules) {
      const participantSchedules = schedules[participantId];

      for (const date in participantSchedules) {
        const daySchedules = participantSchedules[date];

        for (const schedule of daySchedules) {
          if (isOverlapping(commonSlot, schedule)) {
            overlaps = true;
            break;
          }
        }

        if (overlaps) break;
      }

      if (overlaps) break;
    }
    if (!overlaps) {
      availableSlots.push(`${commonSlot.start} - ${commonSlot.end}`);
    }
  }

  return availableSlots;
}
