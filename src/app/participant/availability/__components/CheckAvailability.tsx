"use client";
import { Participants } from "@/app/__types/participants.type";
import { useState } from "react";
import { AvailableSlot } from "@/app/__types/available-slot.type";
import CheckAvailabilityForm from "./CheckAvailabilityForm";
import { SAMPLE_OUTPUT } from "@/app/__constants/default-values";
import AvailableSlots from "./AvailableSlots";

export default function CheckAvailability({
  participants,
}: {
  participants: Participants;
}) {
  const [isOutputVisible, setIsOutputVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<
    AvailableSlot | undefined
  >(SAMPLE_OUTPUT);

  return (
    <div className="space-y-16">
      <div className="flex justify-center xl:w-[30%]  mx-auto ">
        <CheckAvailabilityForm
          participants={participants}
          setAvailableSlot={setAvailableSlots}
          setSlotVisible={setIsOutputVisible}
        />
      </div>
      {isOutputVisible && <AvailableSlots availableSlots={availableSlots} />}
    </div>
  );
}
