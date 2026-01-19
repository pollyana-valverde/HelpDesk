import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useApiMutation } from "../../hooks/api/";
import { useServices } from "../../hooks/pages/useServices";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { formatCurrency } from "../../utils/formatCurrency";

import { Header } from "../../components/Header/Index";
import { Card } from "../../components/Card/Index";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Textarea } from "../../components/Textarea";
import { Select } from "../../components/Select";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Loading } from "../../components/Loading";

type FormData = {
  title: string;
  description: string;
  serviceId: string;
};

const ticketCreationSchema = z.object({
  title: z
    .string("Informe o título do chamado")
    .trim()
    .min(1, "Informe o título do chamado"),
  description: z
    .string("Informe a descrição do chamado")
    .trim()
    .min(1, "Informe a descrição do chamado"),
  serviceId: z.uuid("Selecione um serviço"),
});

export function TicketForm() {
  const navigate = useNavigate();
  const {
    mutate,
    error: mutationError,
    isLoading: isMutating,
  } = useApiMutation();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      serviceId: "",
    },
    resolver: zodResolver(ticketCreationSchema),
  });
  const { services, isLoading } = useServices();

  const watchedServiceId = watch("serviceId");

  const selectedService = useMemo(
    () => services.find((service) => service.id === watchedServiceId),
    [services, watchedServiceId],
  );

  async function handleTicketSubmit(data: FormData) {
    const payload = {
      title: data.title,
      description: data.description,
      serviceIds: [data.serviceId],
    };

    await mutate("/tickets/new", "POST", payload);

    if (
      confirm(
        "Chamado criado com sucesso! Deseja voltar para a página inicial?",
      )
    ) {
      navigate("/");
    }
  }

  return (
    <div className="grid gap-4 md:gap-6 max-w-250 m-auto">
      <Header.Root>
        <Header.Head>Novo chamado</Header.Head>
      </Header.Root>

      <form
        onSubmit={handleSubmit(handleTicketSubmit)}
        className="grid md:flex gap-4 md:gap-6"
      >
        <Card.Root className="flex-2 gap-5 md:gap-6">
          <Card.Head className="gap-0.5">
            <h2 className="font-bold text-gray-800">Informações</h2>
            <p className="text-xs text-gray-500">
              Detalhe o seu problema para que um técnico possa te ajudar.
            </p>
          </Card.Head>

          <Card.Body className="gap-4">
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  required
                  legend="Título"
                  placeholder="Digite um título para o chamado"
                  {...field}
                  helperText={errors.title?.message}
                  hasValidationError={Boolean(errors.title)}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  required
                  legend="Descrição"
                  placeholder="Descreva o que está acontecendo"
                  {...field}
                  helperText={errors.description?.message}
                  hasValidationError={Boolean(errors.description)}
                />
              )}
            />

            <Controller
              control={control}
              name="serviceId"
              render={({ field }) => (
                <Select
                  required
                  legend="Serviços"
                  {...field}
                  helperText={errors.serviceId?.message}
                  hasValidationError={Boolean(errors.serviceId)}
                >
                  <option
                    className="font-bold text-gray-400"
                    value=""
                    disabled
                    hidden
                  >
                    Selecione a categoria de atendimento
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
          </Card.Body>
        </Card.Root>

        <Card.Root className="gap-5 md:gap-6 flex-1 h-fit">
          <Card.Head className="gap-2">
            <h2 className="font-bold text-gray-800">Resumo</h2>
            <p className="text-xs text-gray-800">Valores e detalhes</p>
          </Card.Head>

          <Card.Body className="gap-4">
            <div className="grid gap-0.5">
              <span className="text-xs text-gray-400 font-bold">
                Categoria de serviço
              </span>
              <p className="text-sm text-gray-800">
                {selectedService?.name || "Nenhum serviço selecionado"}
              </p>
            </div>

            <div className="grid gap-0.5">
              <span className="text-xs text-gray-400 font-bold">
                Custo inicial
              </span>
              <div className="flex  items-baseline gap-1">
                <p className="text-xs font-bold text-gray-800">R$</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatCurrency(selectedService?.price || 0)}
                </p>
              </div>
            </div>
          </Card.Body>
          <p className="text-xs text-gray-500">
            O chamado será automaticamente atribuído a um técnico disponível
          </p>
          <Button type="submit">Criar chamado</Button>
        </Card.Root>
      </form>

      <ErrorMessage message={mutationError} />

      <Loading isLoading={isLoading || isMutating} />
    </div>
  );
}
