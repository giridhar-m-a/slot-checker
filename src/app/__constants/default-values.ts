import { AvailableSlot } from "../__types/available-slot.type";

export const PARTICIPANTS = {
  1: { name: "Adam", threshold: 4 },
  2: { name: "Bosco", threshold: 4 },
  3: { name: "Catherine", threshold: 5 },
};

export const PARTICIPANT_AVAILABILITY = {
  1: {
    Monday: [
      { start: "09:00", end: "11:00" },
      { start: "14:00", end: "16:30" },
    ],
    Tuesday: [{ start: "09:00", end: "18:00" }],
  },
  2: {
    Monday: [{ start: "09:00", end: "18:00" }],
    Tuesday: [{ start: "09:00", end: "11:30" }],
  },
  3: {
    Monday: [{ start: "09:00", end: "18:00" }],
    Tuesday: [{ start: "09:00", end: "18:00" }],
  },
};

export const SCHEDULES = {
  1: {
    "28/10/2024": [
      { start: "09:30", end: "10:30" },
      {
        start: "15:00",
        end: "16:30",
      },
    ],
  },
  2: {
    "28/10/2024": [{ start: "13:00", end: "13:30" }],
    "29/10/2024": [{ start: "09:00", end: "10:30" }],
  },
};

export const SAMPLE_OUTPUT: AvailableSlot = {
  "11/10/2024": ["09:00-09:30", "10:30-11:00", "14:00-14:30", "14:30-15:00"],
  "12/10/2024": ["10:30-11:00"],
  "14/10/2024": ["10:30-11:00", "11:00-11:30"],
};
