import { useState } from "react";
import { useApiMutation, useApiQuery } from "../../hooks/api/";

import { Header } from "../../components/Header/Index";
import { Button } from "../../components/Button";
import { Plus } from "lucide-react";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Loading } from "../../components/Loading";

import { ServiceList } from "./List";
import { ServiceForm } from "./Form";

type FormData = {
  name: string;
  price: number;
};

export function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<
    ServiceApiResponse | undefined
  >(undefined);

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

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setIsEditMode(false);
    setServiceToEdit(undefined);
  }

  function handleEdit(service: ServiceApiResponse) {
    setIsEditMode(true);
    setServiceToEdit(service);
    openModal();
  }

  async function toggleServiceStatus(serviceId: string, isActive: boolean) {
    await mutate(`/services/${serviceId}/update`, "PUT", {
      isActive: !isActive,
    });

    await refetchData();
  }

  async function handleCreateService(data: FormData) {
    await mutate("/services", "POST", data);
    await refetchData();

    closeModal();
  }

  async function handleUpdateService(data: FormData) {
    if (!serviceToEdit) return;

    await mutate(`/services/${serviceToEdit.id}/update`, "PUT", data);
    await refetchData();

    closeModal();
  }

  const onSubmit = isEditMode ? handleUpdateService : handleCreateService;

  return (
    <div className="grid gap-6">
      <Header.Root className="flex">
        <Header.Head>Serviços</Header.Head>
        <Header.Action>
          <Button onClick={openModal}>
            <Plus className="h-4.5 w-4.5" />{" "}
            <h2 className="hidden md:flex">Novo</h2>
          </Button>
        </Header.Action>
      </Header.Root>

      <ServiceList
        services={services || []}
        onToggleStatus={toggleServiceStatus}
        onEdit={handleEdit}
      />

      <ErrorMessage message={queryError || mutationError} />

      <Loading isLoading={isLoading || isMutating} />

      <ServiceForm
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        isLoading={isMutating || isLoading}
        serviceToEdit={serviceToEdit}
        onClose={closeModal}
        onSubmit={onSubmit}
      />
    </div>
  );
}
