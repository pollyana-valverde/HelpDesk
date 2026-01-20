import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { useApiMutation } from "../../hooks/api";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Trash } from "lucide-react";
import { Button } from "../../components/Button";
import { ProfileIcon } from "../../components/ProfileIcon";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal/Index";
import { Tag } from "../../components/Tag";
import { ErrorMessage } from "../../components/ErrorMessage";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChangePassword: () => void;
  onDeleteAccount: () => void;
  onUserInfoChange: () => void;
};

const changePasswordSchema = z.object({
  name: z.string().min(1, "Informe o nome."),
  email: z.email("Email inválido").min(1, "Informe o e-mail"),
});

type FormData = z.infer<typeof changePasswordSchema>;

export function ProfileModal({
  isOpen,
  onClose,
  onOpenChangePassword,
  onUserInfoChange,
  onDeleteAccount,
}: ProfileModalProps) {
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
      onUserInfoChange();
    }
  }

  async function handleDeleteAccount() {
    const response = await mutate(
      `/clients/${session?.user.id}/delete`,
      "DELETE",
    );

    if (response) {
      onDeleteAccount();
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <Modal.Root>
      <Modal.Head onClose={onClose}>Perfil</Modal.Head>
      <form onSubmit={handleSubmit(handleChangePassword)}>
        <Modal.Body>
          <div className="grid gap-4">
            <div className="flex items-center justify-between gap-4">
              <ProfileIcon username={session?.user?.name || ""} />

              {session?.user.role === "client" && (
                <Button
                  title="Deletar conta"
                  color="secondary"
                  size="small"
                  onClick={handleDeleteAccount}
                >
                  <Trash className="w-4 h-4 text-red-700" />
                  Deletar conta
                </Button>
              )}
            </div>

            <Input
              disabled={session?.user.role === "expert"}
              legend="Nome"
              {...register("name")}
              hasValidationError={!!errors.name}
              helperText={errors.name?.message}
              value={session?.user?.name}
            />

            <Input
              disabled={session?.user.role === "expert"}
              legend="Email"
              type="email"
              {...register("email")}
              hasValidationError={!!errors.email}
              helperText={errors.email?.message}
              value={session?.user?.email}
            />

            <div className="grid gap-2 relative">
              <Input legend="Senha" type="password" value="********" disabled />
              <Button
                className="absolute right-0 bottom-2.5"
                size="small"
                color="secondary"
                onClick={onOpenChangePassword}
              >
                Alterar
              </Button>
            </div>
          </div>
          <ErrorMessage message={error} />
          {session?.user.role === "expert" && (
            <div className="grid gap-3 mt-2">
              <div>
                <h2 className="text-sm font-bold text-gray-800">
                  Disponibilidade
                </h2>
                <p className="text-xs text-gray-500">
                  Horários de atendimento definidos pelo admin
                </p>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {session.user.availableHours?.map((hour, index) => (
                  <Tag key={index} styleVariant="disabled">
                    {hour}
                  </Tag>
                ))}
              </div>
            </div>
          )}
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
