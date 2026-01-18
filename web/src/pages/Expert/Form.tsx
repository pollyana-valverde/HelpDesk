import { CircleAlert } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useApiMutation, useApiQuery } from "../../hooks/api";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Header } from "../../components/Header/Index";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card/Index";
import { Input } from "../../components/Input";
import { Tag } from "../../components/Tag";
import { ProfileIcon } from "../../components/ProfileIcon";
import { ErrorMessage } from "../../components/ErrorMessage";

import { AVAILABLE_HOURS } from "../../utils/availableHours";

type FormData = {
  name: string;
  email: string;
  password?: string;
  availableHours: string[];
};

export function ExpertForm() {
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
  const { id } = useParams();
  const {
    data: expertData,
    error: queryError,
    isLoading: isQueryLoading,
    refetchData,
  } = useApiQuery<FormData>(`/experts/${id}/show-details`);

  const { mutate, error: mutationError, isLoading } = useApiMutation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
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

  function handleHourSelection(fieldValue: string[], hour: string) {
    if (fieldValue.includes(hour)) {
      return fieldValue.filter((existingHour) => existingHour !== hour);
    }
    return [...fieldValue, hour];
  }

  async function createExpert(data: FormData) {
    await mutate("/experts", "POST", data);

    if (
      confirm(
        "Técnico cadastrado com sucesso! Deseja ir para a tela de técnicos?",
      )
    ) {
      navigate("/experts");
    }
  }

  async function updateExpert(data: FormData) {
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
        <Card.Root className="gap-5 md:gap-6 flex-1">
          <Card.Head className="gap-1">
            <h2 className="font-bold text-gray-800">Dados pessoais</h2>
            <p className="text-xs text-gray-500">
              Defina as informações do perfil de técnico
            </p>
          </Card.Head>

          {id && (
            <ProfileIcon username={expertData?.name} sizeVariant="medium" />
          )}

          <form>
            <Card.Body className="gap-4">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    required
                    legend="Nome"
                    placeholder="Digite o nome completo"
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
                    legend="E-mail"
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                    helperText={errors.email?.message}
                    hasValidationError={Boolean(errors.email)}
                  />
                )}
              />

              {!id && (
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      required
                      legend="Senha"
                      type="password"
                      placeholder="Digite sua senha"
                      {...field}
                      helperText={
                        errors.password?.message ?? "Mínimo de 6 dígitos"
                      }
                      hasValidationError={Boolean(errors.password)}
                    />
                  )}
                />
              )}
            </Card.Body>
          </form>
        </Card.Root>

        <Card.Root className="gap-5 md:gap-6 flex-2 h-fit">
          <Card.Head className="gap-1">
            <h2 className="font-bold text-gray-800">Horários de atendimento</h2>
            <p className="text-xs text-gray-500">
              Selecione os horários de disponibilidade do técnico para
              atendimento
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
      </div>
      <ErrorMessage message={id ? queryError : mutationError} />
    </div>
  );
}
