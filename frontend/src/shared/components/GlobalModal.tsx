import { createContext, PropsWithChildren, useContext } from "react";

import Modal, { modalControl } from "@entities/Modal";

const ModalProvider = (props: PropsWithChildren) => {
  const { modalControl: modal1Control, modalProps: modal1Props } =
    Modal.useModal();
  const { modalControl: modal2Control, modalProps: modal2Props } =
    Modal.useModal();
  const { modalControl: modal3Control, modalProps: modal3Props } =
    Modal.useModal();

  return (
    <ModalContext.Provider
      value={{
        modal1Control,
        modal2Control,
        modal3Control,
      }}
    >
      {props.children}
      <Modal {...modal1Props} />
      <Modal {...modal2Props} />
      <Modal {...modal3Props} />
    </ModalContext.Provider>
  );
};

const ModalContext = createContext<{
  modal1Control?: modalControl;
  modal2Control?: modalControl;
  modal3Control?: modalControl;
}>({});

const useGlobalModal = () => {
  return useContext(ModalContext);
};

const GlobalModal = Object.assign(ModalProvider, { use: useGlobalModal });

export default GlobalModal;
