import { AvailableSlot } from "@/app/__types/available-slot.type";

const AvailableSlots = ({
  availableSlots,
}: {
  availableSlots: AvailableSlot | undefined;
}) => {
  return (
    availableSlots &&
    Object.keys(availableSlots).length > 0 && (
      <div className=" w-[50%] mx-auto rounded-lg bg-[#f5f0e6] p-8 space-y-8">
        {Object.entries(availableSlots).map(([date, slots]) => (
          <div key={date} className="flex items-center space-x-6">
            <h2 className="text-lg font-semibold">{date}</h2>
            <p>:</p>
            <ul className="flex space-x-4 flex-wrap">
              {slots.map((slot, index) => (
                <li
                  key={index}
                  className="bg-[#5f5fe1] text-white px-4 py-2 rounded-xl basis-1/7"
                >
                  {slot}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  );
};

export default AvailableSlots;
