import React from "react";
import "../styles/components/_imageModal.scss";

const ImageModal = ({ image, alt, onClose }) => {
  return (
    <div className="image-modal" onClick={onClose}>
      <div className="modal-content">
        <img src={image} alt={alt} onClick={(e) => e.stopPropagation()} />
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
