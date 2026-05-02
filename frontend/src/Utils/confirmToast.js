import { toast } from "react-toastify";

export const confirmToast = ({
  message = "Are you sure?",
  onConfirm,
  confirmText = "Yes",
  cancelText = "No"
}) => {
  toast.info(
    ({ closeToast }) => (
      <div>
        <p>{message}</p>

        <div className="d-flex justify-content-between mt-2">
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              onConfirm();
              closeToast();
            }}
          >
            {confirmText}
          </button>

          <button
            className="btn btn-sm btn-secondary"
            onClick={closeToast}
          >
            {cancelText}
          </button>
        </div>
      </div>
    ),
    { autoClose: false }
  );
};