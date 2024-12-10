/* eslint-disable @typescript-eslint/ban-ts-comment */
"use server";

import { AvailableSlot as CommonAvailability } from "@/app/__types/available-slot.type";
import {
  Participant,
  ParticipantAvailability,
  Participants,
  ParticipantSlot,
  Schedules,
  TimeSlot,
} from "@/app/__types/participants.type";
import { AvailabilityFormInput } from "@/app/participant/availability/__types/availability-form-input.type";
import {
  getParticipantAvailability,
  getParticipants,
  getSchedules,
} from "@/lib/get-redis-data";
import { formatDate, parseTime } from "@/lib/Time-functions";

export const checkParticipantAvailableSlots = async (
  data: AvailabilityFormInput
) => {
  try {
    const participants = await getParticipants();
    const participantAvailability = await getParticipantAvailability();
    const schedules = await getSchedules();

    console.log("shedules: ", JSON.stringify(schedules));

    const participantSlot = getUserSlot(
      data,
      participantAvailability,
      participants
    );

    const result = getCommonAvailability(
      schedules,
      data.participants,
      participantSlot
    );

    console.log("result: ", JSON.stringify(result));

    return result;
  } catch (err) {
    console.log(err);
  }
};

const getUserSlot = (
  data: AvailabilityFormInput,
  userAvailability: ParticipantAvailability,
  users: Participants
): ParticipantSlot => {
  const { participants, date_range } = data;
  const startDate = new Date(date_range.start);
  const endDate = new Date(date_range.end);
  const result: ParticipantSlot = {};

  for (const participantId of participants) {
    const participant: Participant = users[participantId];
    const participantAvailability = userAvailability[participantId];

    const participantThreshold = participant.threshold;
    result[participantId] = [];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const formattedDate = formatDate(date);
      const dayName = date.toLocaleString("en-US", { weekday: "long" });

      if (participantAvailability[dayName]) {
        const availableSlots = participantAvailability[dayName];

        let dailyMeetings = 0;
        const daySlots: TimeSlot[] = [];

        for (const slot of availableSlots) {
          // Break the time slot into 30-minute chunks
          const splitSlots = splitTimeSlot(slot.start, slot.end, date);

          for (const chunk of splitSlots) {
            if (dailyMeetings >= participantThreshold) break;
            daySlots.push(chunk);
            dailyMeetings++;
          }

          if (dailyMeetings >= participantThreshold) break;
        }

        if (daySlots.length > 0) {
          result[participantId].push({
            [formattedDate]: daySlots,
          });
        }
      }
    }
  }

  return result;
};

const splitTimeSlot = (
  start: string,
  end: string,
  baseDate: Date
): TimeSlot[] => {
  const startDate = parseTime(baseDate, start);
  const endDate = parseTime(baseDate, end);
  const slots: TimeSlot[] = [];

  while (startDate < endDate) {
    const chunkEnd = new Date(startDate);
    chunkEnd.setMinutes(chunkEnd.getMinutes() + 30);

    if (chunkEnd > endDate) break;

    slots.push({
      start: startDate.toTimeString().slice(0, 5),
      end: chunkEnd.toTimeString().slice(0, 5),
    });

    startDate.setMinutes(startDate.getMinutes() + 30);
  }

  return slots;
};

const getOverlapSlot = (slot1: TimeSlot, slot2: TimeSlot): TimeSlot | null => {
  const start = new Date(
    Math.max(
      new Date(`1970-01-01T${slot1.start}:00`).getTime(),
      new Date(`1970-01-01T${slot2.start}:00`).getTime()
    )
  );
  const end = new Date(
    Math.min(
      new Date(`1970-01-01T${slot1.end}:00`).getTime(),
      new Date(`1970-01-01T${slot2.end}:00`).getTime()
    )
  );

  if (start >= end) return null;

  return {
    start: start.toISOString().slice(11, 16),
    end: end.toISOString().slice(11, 16),
  };
};

// Function to find common availability
const getCommonAvailability = (
  schedules: Schedules,
  participantIds: string[],
  userSlots: {
    [id: string]: {
      [date: string]: TimeSlot[];
    }[];
  }
): CommonAvailability => {
  const commonAvailability: CommonAvailability = {};
  const uniqueDates = new Set<string>();

  // Step 1: Aggregate unique dates
  for (const participantId of participantIds) {
    const participantSchedule = schedules[participantId] || {};
    for (const date of Object.keys(participantSchedule)) {
      uniqueDates.add(date);
    }
  }
  console.log("Unique Dates:", Array.from(uniqueDates));

  // Step 2: Find common slots for each date
  for (const date of uniqueDates) {
    const dailySlots: TimeSlot[][] = participantIds.map((id) => {
      const userSchedule = userSlots[id] || [];
      for (const daySchedule of userSchedule) {
        if (daySchedule[date]) return daySchedule[date];
      }
      return [];
    });

    console.log(`Date: ${date}, Daily Slots:`, dailySlots);

    if (dailySlots.some((slots) => slots.length === 0)) continue;

    let commonSlots = dailySlots[0];
    for (let i = 1; i < dailySlots.length; i++) {
      const newCommonSlots: TimeSlot[] = [];
      for (const slot1 of commonSlots) {
        for (const slot2 of dailySlots[i]) {
          const overlap = getOverlapSlot(slot1, slot2);
          console.log("Overlap:", overlap);
          if (overlap) newCommonSlots.push(overlap);
        }
      }
      commonSlots = newCommonSlots;
      if (commonSlots.length === 0) break;
    }

    if (commonSlots.length > 0) {
      //@ts-ignore
      commonAvailability[date] = commonSlots;
    }
  }

  console.log("Final Common Availability:", commonAvailability);
  return commonAvailability;
};
