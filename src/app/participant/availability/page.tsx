import { Participants } from "@/app/__types/participants.type";
import { getParticipants } from "@/lib/get-redis-data";
import CheckAvailability from "./__components/CheckAvailability";

export default async function Page() {
  const participants: Participants = await getParticipants();

  return (
    <main className="py-24">
      <div className="space-y-16">
        <h1 className="text-3xl font-bold underline text-center">
          Check Availability
        </h1>
        <CheckAvailability participants={participants} />
      </div>
    </main>
  );
}
