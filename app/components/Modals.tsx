import {
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from "@roketid/windmill-react-ui";

interface IModal {
  children: React.ReactNode;
  isModalOpen: boolean;
  buttonText: string
  onCloseModal: () => void;
  onSubmit: () => void;
}

function Modals({ children, isModalOpen, buttonText, onCloseModal, onSubmit }: IModal) {
  return (
    <Modal isOpen={isModalOpen} onClose={onCloseModal}>
      <ModalBody className="overflow-y-auto max-h-96">{children}</ModalBody>
      <ModalFooter>
        <div className="hidden sm:block">
          <Button layout="outline" onClick={onCloseModal}>
            Hủy
          </Button>
        </div>
        <div className="hidden sm:block" onClick={onSubmit}>
          <Button>{buttonText}</Button>
        </div>
        <div className="block w-full sm:hidden">
          <Button block size="large" layout="outline" onClick={onCloseModal}>
            Hủy
          </Button>
        </div>
        <div className="block w-full sm:hidden">
          <Button block size="large" onClick={onSubmit}>
            {buttonText}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default Modals;
