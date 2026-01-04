import "../css/ConfirmModal.css";

export default function ConfirmModal({ title, message, onCancel, onConfirm, hasPayments }) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>{title}</h3>
                <p>{message}</p>

                {hasPayments && (<p className="warning-text">No se puede eliminar un alumno con pagos registrados.</p>
                )}
                <div className="modal-actions">
                <button className="btn-cancel" onClick={onCancel}>
                    Cancelar
                </button>
                <button className="btn-danger" disabled={hasPayments} onClick={onConfirm}>
                    Eliminar
                </button>
                </div>
            </div>
        </div>
    );
}
