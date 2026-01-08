import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentById } from "./api/students";
import { getPaymentsByStudent } from "./api/payments";
import PaymentForm from "./components/PaymentForm";
import { createPaymentForStudent } from "./api/payments";
import "./css/StudentDetailPage.css";
import { useNavigate } from "react-router-dom";
import { deleteStudent } from "./api/students";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";

export default function StudentDetailPage() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [payments, setPayments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();
    const hasPayments = payments.length > 0;

    function handleCreatePayment(data) {
    createPaymentForStudent(id, data).then(() => {
        getStudentById(id).then(setStudent);
        getPaymentsByStudent(id).then(setPayments);
        setShowForm(false);
    });
}

    useEffect(() => {
        getStudentById(id).then(setStudent);
        getPaymentsByStudent(id).then(setPayments);
    }, [id])

    function handleDelete() {
        deleteStudent(id).then(() => {
            setToast("Alumno eliminado con éxito");
            setShowDelete(false);
            setTimeout(() => navigate("/"), 1000);
        })
        .catch(() => {
            setToast("Error al eliminar el alumno");
        });
    }


    if (!student) 
        return <p>Cargando alumno...</p>;
    
    return (
        <div className="page-container">
        <div className="student-detail">
            <div className="student-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                ← Volver
                </button>

                <button className="btn-menu" onClick={() => setShowMenu(prev => !prev)}>⋮</button>

                {showMenu && (
                    <div className="menu-dropdown">
                        <button className="btn-update" onClick={() => {setShowMenu(false); navigate(`/students/${id}/edit`)}}>Editar</button>
                        <button className="btn-delete" onClick={() => {setShowDelete(true); setShowMenu(false);}}>Eliminar</button>
                    </div>
                )}
            </div>

            <div className="student-card-detail">
                <h2>{student.surname} {student.name}</h2>

                <div className="student-info-line">
                    <strong>Estado:</strong>{" "}
                    <span className={`student-status status-${student.status}`}>
                        {student.status.replace("_", " ")}
                    </span>
                </div>
            </div>

            <div className="payments-section">
                <h3>Historial de pagos</h3>

                {payments.length === 0 ? (
                <p>Este alumno no tiene pagos registrados.</p>
                ) : (
                <ul className="payment-list">
                    {payments.map(payment => (
                    <li key={payment.id} className="payment-item">
                        <div><strong>Monto:</strong> ${payment.amount}</div>
                        <div><strong>Periodo:</strong> {payment.period}</div>
                        <div><strong>Pago:</strong> {payment.paymentDate}</div>
                        <div><strong>Vence:</strong> {payment.dueDate}</div>
                    </li>
                    ))}
                </ul>
                )}
            </div>

                {!showForm && (
                    <button className="btn-register" onClick={() => setShowForm(true)}>
                    Registrar pago
                    </button>
                )}

            {showDelete && (
                <ConfirmModal
                    title="Eliminar alumno"
                    message="¿Estás seguro de que querés eliminar este alumno? Esta acción no se puede deshacer."
                    onCancel={() => setShowDelete(false)}
                    onConfirm={handleDelete}
                    hasPayments={hasPayments}
                />
            )}

            {showForm && (
                <PaymentForm
                onSubmit={handleCreatePayment}
                onCancel={() => setShowForm(false)}
                />
            )}

            {toast && (
                    <Toast
                        message={toast}
                        onClose={() => setToast(null)}
                    />
                 )}
        </div>
        </div>

    )
}