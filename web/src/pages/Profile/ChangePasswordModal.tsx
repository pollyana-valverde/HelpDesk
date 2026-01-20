import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useApiMutation } from "../../hooks/api";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal/Index";
import { ErrorMessage } from "../../components/ErrorMessage";

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChanged: () => void;
  openProfileModal?: () => void;
};

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Informe a senha atual."),
  newPassword: z
    .string()
    .min(6, "A nova senha deve ter no mínimo 6 caracteres."),
});

type FormData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordModal({
  isOpen,
  onClose,
  onPasswordChanged,
  openProfileModal,
}: ChangePasswordModalProps) {
  const { session } = useAuth();
  const { mutate, isLoading, error } = useApiMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function handleChangePassword(data: FormData) {
    let response;
    const endpoint =
      session?.user.role === "expert"
        ? "/experts/update-password"
        : "/clients/update-password";

    response = await mutate(endpoint, "PATCH", data);

    if (response) {
      onPasswordChanged();
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <Modal.Root>
      <Modal.Head onClose={onClose} onGoBack={openProfileModal} goBack>
        Alterar Senha
      </Modal.Head>
      <form onSubmit={handleSubmit(handleChangePassword)}>
        <Modal.Body>
          <div className="grid gap-4">
            <Input
              legend="Senha Atual"
              type="password"
              {...register("currentPassword")}
              placeholder="Digite sua senha atual"
              hasValidationError={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
            />
            <Input
              legend="Nova Senha"
              type="password"
              placeholder="Digite sua nova senha"
              {...register("newPassword")}
              hasValidationError={!!errors.newPassword}
              helperText={errors.newPassword?.message || "Mínimo de 6 dígitos"}
            />
          </div>
          <ErrorMessage message={error} />
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" isLoading={isLoading} className="md:w-full">
            Salvar
          </Button>
        </Modal.Footer>
      </form>
    </Modal.Root>
  );
}
