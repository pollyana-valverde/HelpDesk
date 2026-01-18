import { CircleAlert } from "lucide-react";
import { Controller,type Control, type FieldErrors } from "react-hook-form";
import { Card } from "../components/Card/Index";
import { Tag } from "./Tag";
import { AVAILABLE_HOURS } from "../utils/availableHours";

function handleHourSelection(fieldValue: string[], hour: string) {
  if (fieldValue.includes(hour)) {
    return fieldValue.filter((existingHour) => existingHour !== hour);
  }
  return [...fieldValue, hour];
}

type AvailableHoursProps = {
  control: Control<UserData>;
  errors: FieldErrors<UserData>;
  isLoading?: boolean;
}

export function AvailableHours({ control, errors, isLoading }: AvailableHoursProps) {
  return (
    <Card.Root className="gap-5 md:gap-6 flex-2 h-fit">
      <Card.Head className="gap-1">
        <h2 className="font-bold text-gray-800">Horários de atendimento</h2>
        <p className="text-xs text-gray-500">
          Selecione os horários de disponibilidade do técnico para atendimento
        </p>
      </Card.Head>
      <Controller
        control={control}
        name="availableHours"
        render={({ field }) => (
          <Card.Body className="gap-4 md:gap-5">
            <div className="grid gap-2">
              <span className="uppercase text-xxs text-gray-500 font-bold">
                Manhã
              </span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_HOURS["morning"].map((hour, index) => (
                  <Tag
                    key={index}
                    styleVariant={isLoading ? "disabled" : "default"}
                    isSelected={field.value.includes(hour)}
                    onClick={() =>
                      field.onChange(handleHourSelection(field.value, hour))
                    }
                  >
                    {hour}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <span className="uppercase text-xxs text-gray-500 font-bold">
                Tarde
              </span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_HOURS["afternoon"].map((hour, index) => (
                  <Tag
                    key={index}
                    styleVariant={isLoading ? "disabled" : "default"}
                    isSelected={field.value.includes(hour)}
                    onClick={() =>
                      field.onChange(handleHourSelection(field.value, hour))
                    }
                  >
                    {hour}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <span className="uppercase text-xxs text-gray-500 font-bold">
                Noite
              </span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_HOURS["night"].map((hour, index) => (
                  <Tag
                    key={index}
                    styleVariant={isLoading ? "disabled" : "default"}
                    isSelected={field.value.includes(hour)}
                    onClick={() =>
                      field.onChange(handleHourSelection(field.value, hour))
                    }
                  >
                    {hour}
                  </Tag>
                ))}
              </div>
            </div>
            {errors.availableHours && (
              <p className="text-xs mt-1.5 flex text-red-700 ">
                <CircleAlert className="w-4 h-4 mr-1" />
                {errors.availableHours.message}
              </p>
            )}
          </Card.Body>
        )}
      />
    </Card.Root>
  );
}
