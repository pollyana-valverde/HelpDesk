import { useClients } from "../../hooks/pages/useClients"; 
import { Header } from "../../components/Header/Index";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Loading } from "../../components/Loading";
import { ClientList } from "./List";
import { DeleteClientModal } from "./Delete";
import { EditClientModal } from "./Edit";

export function Clients() {
  const {
    clients,
    error,
    isLoading,
    activeModal,
    selectedClient,
    handleDeleteClient,
    handleEditClient,
    openDeleteModal,
    openEditModal,
    closeModal,
  } = useClients();

  return (
    <div className="grid gap-6">
      <Header.Root>
        <Header.Head>Clientes</Header.Head>
      </Header.Root>

      <ClientList
        clients={clients}
        onModalDelete={openDeleteModal}
        onModalEdit={openEditModal}
      />

      <ErrorMessage message={error} />
      <Loading isLoading={isLoading} />

      <DeleteClientModal
        isLoading={isLoading}
        clientToDeleteName={selectedClient?.name || ""}
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
        onDelete={handleDeleteClient}
      />

      <EditClientModal
        client={selectedClient} 
        onSubmit={handleEditClient}
        isOpen={activeModal === 'edit'}
        onClose={closeModal}
        isLoading={isLoading}
      />
    </div>
  );
}