import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal/Index";
import { Input } from "../../components/Input";

type FormData = {
  name: string;
  price: number;
};

type ServiceFormProps = {
  isOpen: boolean;
  isEditMode: boolean;
  isLoading: boolean;
  serviceToEdit?: ServiceApiResponse;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
};

const serviceCreationSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do serviço"),
  price: z
    .number("O valor deve ser um número")
    .min(0, "O valor do serviço deve ser maior ou igual a 0"),
});

export function ServiceForm({
  isOpen,
  isEditMode,
  isLoading,
  serviceToEdit,
  onClose,
  onSubmit,
}: ServiceFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      price: undefined,
    },
    resolver: zodResolver(serviceCreationSchema),
  });

  useEffect(() => {
    if (isEditMode && serviceToEdit) {
      reset({
        name: serviceToEdit.name,
        price: serviceToEdit.price,
      });
    } else {
      reset({
        name: "",
        price: undefined,
      });
    }
  }, [isEditMode, serviceToEdit, reset]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal.Root>
      <Modal.Head onClose={onClose}>
        {isEditMode ? "Serviço" : "Cadastro de serviço"}
      </Modal.Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className="grid gap-4">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  required
                  legend="Nome"
                  placeholder="Digite o nome do serviço"
                  {...field}
                  helperText={errors.name?.message}
                  hasValidationError={Boolean(errors.name)}
                />
              )}
            />
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, ...restField } }) => (
                <Input
                  required
                  legend="Valor"
                  placeholder="R$ 0,00"
                  type="number"
                  {...restField}
                  onChange={(e) => onChange(e.target.valueAsNumber)}
                  helperText={errors.price?.message}
                  hasValidationError={Boolean(errors.price)}
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
