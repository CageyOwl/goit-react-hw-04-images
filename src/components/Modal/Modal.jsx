import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import css from './modal.module.css';

const modalRoot = document.querySelector('#modal-root');
const closingCode = 'Escape';

export default function Modal({ onClose, onKeyDown, imageAlt, imageURL }) {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === closingCode) {
        onKeyDown();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyDown]);

  return createPortal(
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal}>
        <img className="" alt={imageAlt} src={imageURL} />
      </div>
    </div>,
    modalRoot
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  imageAlt: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
};
