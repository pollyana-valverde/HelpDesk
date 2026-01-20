import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { formatCurrency } from "../../utils/formatCurrency";

import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal/Index";
import { Select } from "../../components/Select";
import { Input } from "../../components/Input";

type FormData = {
  name: string;
  price: string;
};

type AdditionalServiceProps = {
  services: ServiceApiResponse[];
  isLoading: boolean;
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (serviceIds: string[]) => void;
};

const ticketCreationSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do serviço"),
  price: z.string(),
});

export function TicketAdditionalService({
  services,
  isOpen,
  isLoading,
  closeModal,
  onSubmit,
}: AdditionalServiceProps) {
  const [servicePrice, setServicePrice] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      price: "",
    },
    resolver: zodResolver(ticketCreationSchema),
  });

  if (!isOpen) {
    return null;
  }

  function handleServiceChange(serviceIds: string) {
    const selectedService = services.find((s) => s.id === serviceIds);

    if (selectedService) {
      setValue("price", String(selectedService?.price), {
        shouldValidate: true,
      });
      setServicePrice("R$" + formatCurrency(selectedService.price));
    } else {
      setValue("price", "");
      setServicePrice("");
    }
  }

  function handleOnSubmit(data: FormData) {
    onSubmit([data.name]);
  }

  return (
    <Modal.Root title="Adicionar serviço">
      <Modal.Head onClose={closeModal}>Serviços adicionais</Modal.Head>

      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Modal.Body>
          <div className="grid gap-4">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Select
                  required
                  legend="Título"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleServiceChange(e.target.value);
                  }}
                  helperText={errors.name?.message}
                  hasValidationError={Boolean(errors.name)}
                >
                  <option
                    className="font-bold text-gray-400"
                    value=""
                    disabled
                    hidden
                  >
                    Selecione um serviço
                  </option>

                  {services
                    .filter((activeService) => activeService.isActive)
                    .map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                </Select>
              )}
            />

            <Controller
              control={control}
              name="price"
              render={({ field: { ref, ...restField } }) => (
                <Input
                  required
                  disabled
                  legend="Valor"
                  placeholder="R$ 0,00"
                  {...restField}
                  value={servicePrice}
                />
              )}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button className="md:w-full" type="submit" isLoading={isLoading}>
            Salvar
          </Button>
        </Modal.Footer>
      </form>
    </Modal.Root>
  );
}
