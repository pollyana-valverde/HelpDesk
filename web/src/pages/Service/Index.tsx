// src/pages/Service/Index.tsx (Refatorado com o hook)
import { Header } from "../../components/Header/Index";
import { Button } from "../../components/Button";
import { Plus } from "lucide-react";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Loading } from "../../components/Loading";
import { ServiceList } from "./List";
import { ServiceForm } from "./Form";
import { useServices } from "../../hooks/pages/useService"; 

export function Services() {
  // Chama o hook para obter toda a lógica e estado
  const {
    services,
    error,
    isLoading,
    isModalOpen,
    isEditMode,
    serviceToEdit,
    handleEdit,
    toggleServiceStatus,
    closeModal,
    openModal,
    onSubmit,
  } = useServices();

  // O JSX permanece o mesmo, apenas conectando os pontos
  return (
    <div className="grid gap-6">
      <Header.Root className="flex">
        <Header.Head>Serviços</Header.Head>
        <Header.Action>
          <Button onClick={openModal}>
            <Plus /> <h2 className="hidden md:flex">Novo</h2>
          </Button>
        </Header.Action>
      </Header.Root>

      <ServiceList
        services={services}
        onToggleStatus={toggleServiceStatus}
        onEdit={handleEdit}
      />

      <ErrorMessage message={error} />
      <Loading isLoading={isLoading} />

      <ServiceForm
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        isLoading={isLoading}
        serviceToEdit={serviceToEdit}
        onClose={closeModal}
        onSubmit={onSubmit}
      />
    </div>
  );
}