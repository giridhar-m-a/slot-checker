export type Participant = {
  name: string;
  threshold: number;
};

export type Participants = {
  [id: string]: Participant;
};

export type TimeSlot = {
  start: string;
  end: string;
};

export type ParticipantAvailability = {
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
