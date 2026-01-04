import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StudentForm from "./components/StudentForm";
import { createStudent } from "./api/students";
import Toast from "./components/Toast";

export default function AddStudentPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null); // Estado para el mensaje emergente

  function handleSubmit(data) {
    createStudent(data).then(() => {
        setToast("Alumno registrado con éxito"); // Mostrar mensaje de éxito
        setTimeout(() => navigate("/students"), 2000);
    })
    .catch(() => {
        setToast("Error al registrar el alumno"); // Mostrar mensaje de error
    });
  }

  return (
    <div>
      <h2>Registrar alumno</h2>

      <StudentForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />

      {toast && (
        <Toast
            message={toast}
            onClose={() => setToast(null)}
        />
     )}

    </div>
  );
}
