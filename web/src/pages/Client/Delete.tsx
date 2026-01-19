import { Modal } from "../../components/Modal/Index";
import { Button } from "../../components/Button";

type DeleteClientModalProps = {
  clientToDeleteName: string;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onDelete?: () => void;
};

export function DeleteClientModal({
  clientToDeleteName,
  isOpen,
  isLoading,
  onClose,
  onDelete,
}: DeleteClientModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal.Root>
      <Modal.Head onClose={onClose}>Excluir Cliente</Modal.Head>
      <Modal.Body>
        <p>
          Deseja realmente excluir <strong>{clientToDeleteName}</strong>?
        </p>
        <p>
          Ao excluir, todos os chamados deste cliente serão removidos e esta
          ação não poderá ser desfeita.
        </p>
      </Modal.Body>
      <Modal.Footer>
          <Button color="secondary" onClick={onClose} >
            Cancelar
          </Button>
          <Button onClick={onDelete} isLoading={isLoading}>Sim, excluir</Button>
      </Modal.Footer>
    </Modal.Root>
  );
}
