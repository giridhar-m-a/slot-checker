import {
  ParticipantAvailability,
  Participants,
  Schedules,
} from "@/app/__types/participants.type";
import redisClient from "./redis-client";

const getParticipants = async (): Promise<Participants> => {
  const participants = await redisClient.get("participants");
  if (!participants) return {};
  return JSON.parse(participants);
};

const getParticipantAvailability =
  async (): Promise<ParticipantAvailability> => {
    const availability = await redisClient.get("participantAvailability");
    if (!availability) return {};
    return JSON.parse(availability);
  };

const getSchedules = async (): Promise<Schedules> => {
  const schedules = await redisClient.get("schedules");
  if (!schedules) return {};
  return JSON.parse(schedules);
};

export { getParticipantAvailability, getParticipants, getSchedules };
