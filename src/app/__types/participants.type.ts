export type Participant = {
  name: string;
  threshold: number;
};

export type Participants = {
  [id: number]: Participant;
};

export type TimeSlot = {
  start: string;
  end: string;
};

export type ParticipantsAvailability = {
  [id: string]: {
    [day: string]: TimeSlot[];
  };
};

export type Schedules = {
  [id: string]: {
    [date: string]: TimeSlot[];
  };
};

export type ParticipantSlot = {
  [id: string]: {
    [date: string]: {
      start: string;
      end: string;
    }[];
  }[];
};

export type TimeRange = {
  start: string;
  end: string;
};

export type ParticipantAvailability = {
  [day: string]: TimeRange[];
};

export type SlotsOutput = {
  [day: string]: TimeRange[];
};

export type FullAvailability = {
  [id: number]: ParticipantAvailability;
};

export type UserSlot = {
  id: number;
  slots: SlotsOutput;
};
