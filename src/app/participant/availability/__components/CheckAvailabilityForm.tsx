/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { checkParticipantAvailableSlots } from "@/app/__actions/participants/check-availability";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTitle,
} from "@/app/__components/MultiSelectInput";
import { AvailableSlot } from "@/app/__types/available-slot.type";
import { Participants } from "@/app/__types/participants.type";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "@/components/ui/DatePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AvailabilityFormInput,
  AvailabilityFormSchema,
} from "../schemas/AvailabilityForm.schema";

const CheckAvailabilityForm: React.FC<{
  participants: Participants;
  setSlotVisible: (value: boolean) => void;
  setAvailableSlot: (value: AvailableSlot) => void;
}> = ({ participants, setSlotVisible, setAvailableSlot }) => {
  const form = useForm<AvailabilityFormInput>({
    resolver: zodResolver(AvailabilityFormSchema),
    defaultValues: {
      participants: [],
      date_range: {
        start: undefined,
        end: undefined,
      },
    },
  });

  console.log(form.formState.errors);

  const onSubmit = async (data: AvailabilityFormInput) => {
    console.log("error", form.formState.errors);
    const res = await checkParticipantAvailableSlots(data);
    if (res) {
      setSlotVisible(true);
      setAvailableSlot(res);
      console.log("result", res);
    }

    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8 w-full px-16"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MultiSelect {...field} className="space-y-2">
                  <MultiSelectTitle className="p-2 w-full justify-between bg-slate-300 rounded-sm">
                    Choose Participants
                  </MultiSelectTitle>
                  <MultiSelectContent className="p-2 w-full bg-slate-300 rounded-sm">
                    {Object.entries(participants).map(([id, participant]) => (
                      <MultiSelectItem
                        key={id}
                        className="p-2 w-full bg-slate-300 rounded-sm"
                      >
                        <Label className="flex gap-2 items-center">
                          <Checkbox
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, Number(id)]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (participantId) =>
                                      participantId !== Number(id)
                                  )
                                );
                              }
                            }}
                            value={id}
                          />
                          {/* @ts-ignore */}
                          <span>{participant.name}</span>
                        </Label>
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_range.start"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  date={field.value}
                  field={field}
                  placeholder="Start Date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_range.end"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  date={field.value}
                  field={field}
                  placeholder="End Date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#5f5fe1] hover:bg-[#5f5fe1] text-white rounded-md disabled:opacity-50  disabled:cursor-auto"
          disabled={form.formState.isSubmitting}
        >
          Check Slots
        </Button>
      </form>
    </Form>
  );
};

export default CheckAvailabilityForm;
