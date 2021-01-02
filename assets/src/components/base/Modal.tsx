import React from "react";

import "./Modal.scss";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onModalClose: () => void;
};

const Modal = ({ title, onModalClose, children }: ModalProps) => {
  return (
    <section className="Modal">
      <span className="Modal-closeBtnWrap">
        <span className="Modal-closeBtn" onClick={onModalClose} />
      </span>
      <header className="Modal-header">
        <h2 className="Modal-title">{title}</h2>
      </header>
      <div className="Modal-body">
        {children}
      </div>
    </section>
  );
};

export default Modal;
