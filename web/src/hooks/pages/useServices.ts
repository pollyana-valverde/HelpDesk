import { useState } from "react";
import { useApiQuery, useApiMutation } from "../api";

type FormData = {
  name: string;
  price: number;
};

export function useServices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceApiResponse | undefined>(undefined);

  const { data: services, error: queryError, isLoading, refetchData } = useApiQuery<ServiceApiResponse[]>("/services");
  const { mutate, isLoading: isMutating, error: mutationError } = useApiMutation();

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

  return {
    services: services || [],
    error: queryError || mutationError,
    isLoading: isLoading || isMutating,
    isModalOpen,
    isEditMode,
    serviceToEdit,
    handleEdit,
    toggleServiceStatus,
    closeModal,
    openModal,
    onSubmit,
  };
}