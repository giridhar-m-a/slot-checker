import {
  FullAvailability,
  ParticipantAvailability,
  Participants,
  Schedules,
} from "@/app/__types/participants.type";
import redisClient from "./redis-client";

/**
 * Retrieves the list of participants from the Redis database.
 *
 * @returns {Promise<Participants>} - An object where keys are participant IDs
 * and values are their details.
 */
const getParticipants = async (): Promise<Participants> => {
  const participants = await redisClient.get("participants");
  if (!participants) return {};
  return JSON.parse(participants);
};

/**
 * Retrieves the availability data for all participants from the Redis database.
 *
 * @returns {Promise<FullAvailability>} - An object where keys are participant IDs
 * and values are their weekly availabilities.
 */
const getParticipantAvailability = async (): Promise<FullAvailability> => {
  const availability = await redisClient.get("participantAvailability");
  if (!availability) return {};
  return JSON.parse(availability);
};

/**
 * Retrieves the schedule data for all participants from the Redis database.
 *
 * @returns {Promise<Schedules>} - An object where keys are participant IDs
 * and values are their schedules.
 */
const getSchedules = async (): Promise<Schedules> => {
  const schedules = await redisClient.get("schedules");
  if (!schedules) return {};
  return JSON.parse(schedules);
};

export { getParticipantAvailability, getParticipants, getSchedules };
