import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById, updateStudent } from "./api/students";
import StudentForm from "./components/StudentForm";
import Toast from "./components/Toast";

export default function EditStudentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getStudentById(id).then(setStudent);
  }, [id]);

  function handleSubmit(data) {
    updateStudent(id, data).then(() => {
        setToast("Alumno actualizado con éxito");
        setTimeout(() => navigate(`/students/${id}`), 2000);
    })
    .catch(() => {
        setToast("Error al actualizar el alumno");
    });
  }

  if (!student) return <p>Cargando alumno...</p>;

  return (
    <div>
      <h2>Editar alumno</h2>

      <StudentForm
        initialData={student}
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
