import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Modal } from "../../components/Modal/Index";
import { ProfileIcon } from "../../components/ProfileIcon";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

type FormData = {
  name: string;
  email: string;
};

type ServiceFormProps = {
  client?: UserAPIResponse["user"];
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
};

const clientUpdateSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do cliente"),
  email: z.email("Informe um email válido"),
});

export function EditClientModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
  client,
}: ServiceFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(clientUpdateSchema),
  });

  useEffect(() => {
    if(client) {
      reset({
        name: client.name,
        email: client.email,
      });
    }
  }, [client, reset]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal.Root>
      <Modal.Head onClose={onClose}>
       Cliente
      </Modal.Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <ProfileIcon username={client?.name} />
          <div className="grid gap-4">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  required
                  legend="Nome"
                  placeholder="Digite o nome do cliente"
                  {...field}
                  helperText={errors.name?.message}
                  hasValidationError={Boolean(errors.name)}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  required
                  legend="Email"
                  placeholder="Digite o email do cliente"
                  type="email"
                  {...field}
                  helperText={errors.email?.message}
                  hasValidationError={Boolean(errors.email)}
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
