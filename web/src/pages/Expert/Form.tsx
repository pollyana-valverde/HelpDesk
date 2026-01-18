import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useApiMutation, useApiQuery } from "../../hooks/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Header } from "../../components/Header/Index";
import { Button } from "../../components/Button";
import { ErrorMessage } from "../../components/ErrorMessage";
import { PersonalData } from "../../components/PersonalData";
import { AvailableHours } from "../../components/AvailableHours";

export function ExpertForm() {
  const { id } = useParams();

  const expertCreationSchema = z
    .object({
      name: z.string().trim().min(1, "Informe o nome"),
      email: z.email("Email inválido").trim().min(1, "Informe o e-mail"),
      password: z
        .string()
        .trim()
        .min(6, "A senha deve ter no mínimo 6 dígitos")
        .optional(),
      availableHours: z
        .array(z.string())
        .min(1, "Selecione ao menos um horário de atendimento")
        .max(8, "Selecione no máximo oito horários de atendimento"),
    })
    .refine(
      (data) => {
        if (!id && (!data.password || data.password.trim() === "")) {
          return false;
        }
        return true;
      },
      {
        message: "Informe a senha",
        path: ["password"],
      },
    )
    .refine(
      (data) => {
        if (data.password && data.password.length < 6) {
          return false;
        }
        return true;
      },
      {
        message: "A senha deve ter no mínimo 6 dígitos",
        path: ["password"],
      },
    );

  const navigate = useNavigate();
  const {
    data: expertData,
    error: queryError,
    isLoading: isQueryLoading,
    refetchData,
  } = useApiQuery<UserData>(`/experts/${id}/show-details`);

  const { mutate, error: mutationError, isLoading } = useApiMutation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      availableHours: [],
    },
    resolver: zodResolver(expertCreationSchema),
  });

  // Preenche o formulário com os dados do técnico ao carregar a página
  useEffect(() => {
    if (expertData) {
      reset(expertData);
    }
  }, [expertData, reset]);

  async function createExpert(data: UserData) {
    await mutate("/experts", "POST", data);

    if (
      confirm(
        "Técnico cadastrado com sucesso! Deseja ir para a tela de técnicos?",
      )
    ) {
      navigate("/experts");
    }
  }

  async function updateExpert(data: UserData) {
    await mutate(`/experts/${id}/update`, "PUT", data);

    await refetchData();

    if (
      confirm(
        "Técnico atualizado com sucesso! Deseja ir para a tela de técnicos?",
      )
    ) {
      navigate("/experts");
    }
  }

  return (
    <div className="grid gap-4 md:gap-6 max-w-250 m-auto">
      <Header.Root>
        <Header.Head goBack>Perfil de técnico</Header.Head>

        <Header.Action>
          <Button color="secondary">Cancelar</Button>
          <Button
            isLoading={isLoading || isQueryLoading}
            onClick={handleSubmit(id ? updateExpert : createExpert)}
          >
            Salvar
          </Button>
        </Header.Action>
      </Header.Root>

      <div className="grid md:flex gap-4 md:gap-6">
        <PersonalData
          id={id}
          control={control}
          errors={errors}
          expertData={expertData}
        />
        <AvailableHours control={control} errors={errors}  isLoading={isLoading || isQueryLoading} />
      </div>
      <ErrorMessage message={id ? queryError : mutationError} />
    </div>
  );
}
