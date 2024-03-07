import React from "react";
import "./modal.css";

const Modal = (props) => {
  return (
    <div className="modal">
      <header className="modal__header">Modal Title</header>
      <section className="modal__content">{props.children}</section>
      <section className="modal__action">
        <button className="btn" onClick={props.onCancel}>Cancel</button>
        <button className="btn" onClick={props.onConfirm}>Confirm</button>
      </section>
    </div>
  );
};

export default Modal;
