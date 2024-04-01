import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const SweetAlert2 = ({ children, show, onClose, title }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (show) {
      MySwal.fire({
        title: title,
        showConfirmButton: false,
        html: <div ref={(el) => setContainer(el)} />,
      }).then(() => {
        onClose && onClose();
      });
    }
  }, [show, onClose, title]);

  if (container) {
    return createPortal(children, container);
  }
  return null;
};

export default SweetAlert2;
