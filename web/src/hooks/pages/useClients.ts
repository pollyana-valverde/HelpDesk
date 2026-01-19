import { useState, useMemo } from "react";
import { useApiQuery, useApiMutation } from "../api";

type FormData = {
  name: string;
  email: string;
};

export function useClients() {
  const [activeModal, setActiveModal] = useState<'edit' | 'delete' | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const {
    data: clients,
    error,
    isLoading,
    refetchData,
  } = useApiQuery<UserAPIResponse["user"][]>("/clients");

  const { mutate, isLoading: isMutating } = useApiMutation();

  const selectedClient = useMemo(() => {
    if (!selectedClientId) return undefined;

    return clients?.find((client) => client.id === selectedClientId);
  }, [clients, selectedClientId]);

  function openDeleteModal(client: { id: string; name: string }) {
    setSelectedClientId(client.id);
    setActiveModal('delete');
  }

  function openEditModal(client: { id: string }) {
    setSelectedClientId(client.id);
    setActiveModal('edit');
  }

  function closeModal() {
    setActiveModal(null);
    setSelectedClientId(null); 
  }

  async function handleDeleteClient() {
    if (!selectedClientId) return;
    await mutate(`/clients/${selectedClientId}/delete`, "DELETE");
    await refetchData();
    closeModal();
  }

  async function handleEditClient(data: FormData) {
    if (!selectedClientId) return;
    await mutate(`/clients/${selectedClientId}/update`, "PUT", data);
    await refetchData();
    closeModal();
  }
  
  return {
    clients: clients || [],
    error,
    isLoading: isLoading || isMutating,
    activeModal,
    selectedClient,
    openDeleteModal,
    openEditModal,
    closeModal,
    handleDeleteClient,
    handleEditClient,
  };
}