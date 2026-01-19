import { useState } from "react";
import { useApiMutation, useApiQuery } from "../hooks/api/";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { classMerge } from "../utils/classMerge";
import { formatCurrency } from "../utils/formatCurrency";

import { Header } from "../components/Header/Index";
import { Table } from "../components/Table/Index";
import { Tag } from "../components/Tag";
import { Button } from "../components/Button";
import { PenLine, Ban, CircleCheck, Plus } from "lucide-react";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";
import { Modal } from "../components/Modal/Index";
import { Input } from "../components/Input";

type FormData = {
  name: string;
  price: number;
};

const TABLE_HEADERS = [
  { label: "Título" },
  { label: "Valor" },
  { label: "Status" },
  { label: "" },
];

const serviceCreationSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do serviço"),
  price: z
    .number("O valor deve ser um número")
    .min(0, "O valor do serviço deve ser maior ou igual a 0"),
});

export function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: services,
    error: queryError,
    isLoading,
    refetchData,
  } = useApiQuery<ServiceApiResponse[]>("/services");

  const {
    mutate,
    isLoading: isMutating,
    error: mutationError,
  } = useApiMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(serviceCreationSchema),
  });

  async function toggleServiceStatus(serviceId: string, isActive: boolean) {
    await mutate(`/services/${serviceId}/update`, "PUT", {
      isActive: !isActive,
    });

    await refetchData();
  }

  async function handleCreateService(data: FormData) {
    await mutate("/services", "POST", data);

    await refetchData();
    setIsModalOpen(false);
  }

    async function handleUpdateService(data: FormData) {
      const serviceId = services?.find((service) => service.name === data.name)?.id;
      if (!serviceId) return;

    await mutate(`/services/${serviceId}/update`, "PUT", data);

    await refetchData();
    setIsModalOpen(false);
  }

  return (
    <div className="grid gap-6">
      <Header.Root className="flex">
        <Header.Head>Serviços</Header.Head>
        <Header.Action>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4.5 w-4.5" />{" "}
            <h2 className="hidden md:flex">Novo</h2>
          </Button>
        </Header.Action>
      </Header.Root>

      <Table.Root>
        <Table.Head>
          {TABLE_HEADERS.map((header, index) => (
            <th
              key={index}
              className={classMerge(
                header.label === "" && "w-[22%] lg:w-[5%]",
                header.label === "Status" && "w-[12%] lg:w-[5%]",
                header.label === "Valor" && "lg:w-[37%]",
                "px-3",
              )}
            >
              {header.label}
            </th>
          ))}
        </Table.Head>

        <Table.Body>
          {services?.map((service) => (
            <Table.Row key={service.id}>
              <Table.Cell className="text-sm font-bold">
                {service.name}
              </Table.Cell>

              <Table.Cell className="text-sm">
                R${formatCurrency(service.price)}
              </Table.Cell>

              <Table.Cell>
                {service.isActive ? (
                  <Tag className="text-lime-700 bg-lime-200 border-none md:px-2">
                    <div className="md:hidden">
                      <CircleCheck className="h-4 w-4" />
                    </div>
                    <h2 className="hidden lg:flex">Ativo</h2>
                  </Tag>
                ) : (
                  <Tag className="text-red-700 bg-red-200 border-none md:px-2">
                    <div className="md:hidden">
                      <Ban className="h-4 w-4" />
                    </div>
                    <h2 className="hidden lg:flex">Inativo</h2>
                  </Tag>
                )}
              </Table.Cell>

              <Table.Cell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    color="link"
                    size="small"
                    onClick={() =>
                      toggleServiceStatus(service.id, service.isActive)
                    }
                  >
                    {service.isActive ? (
                      <div className="flex gap-2 items-center">
                        <Ban className="h-3.5 w-3.5" />
                        <span className="hidden md:flex">Desativar</span>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <CircleCheck className="h-3.5 w-3.5" />
                        <span className="hidden md:flex">Reativar</span>
                      </div>
                    )}
                  </Button>
                  <Button color="secondary" size="iconSmall" onClick={() => {
                    setIsModalOpen(true);
                    reset({
                      name: service.name,
                      price: service.price,
                    });
                  }}>
                    <PenLine className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <ErrorMessage message={queryError || mutationError} />

      <Loading isLoading={isLoading || isMutating} />

      {isModalOpen && (
        <Modal.Root>
          <Modal.Head onClose={() => setIsModalOpen(false)}>
            Cadastro de serviço
          </Modal.Head>
          <form onSubmit={handleSubmit(handleCreateService)}>
            <Modal.Body>
              <div className="grid gap-4">
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
              <Button type="submit" isLoading={isLoading || isMutating}>Salvar</Button>
            </Modal.Footer>
          </form>
        </Modal.Root>
      )}
    </div>
  );
}
