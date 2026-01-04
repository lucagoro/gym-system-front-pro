import { useEffect, useState } from "react";
import { getStudentSummary } from "../api/students";
import "../css/Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getStudentSummary().then(setSummary);
  }, []);

  if (!summary) {
    return <p>Cargando resumen...</p>;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Wolf's Team - Resumen</h2>

      <div className="dashboard-cards">
        <div className="card total" onClick={() => navigate("/students")}>
          <span className="card-label">Total alumnos</span>
          <span className="card-value">{summary.total}</span>
        </div>

        <div className="card active" onClick={() => navigate("/students?status=AL_DIA")}>
          <span className="card-label">Al día</span>
          <span className="card-value">{summary.alDia}</span>
        </div>

        <div className="card expired" onClick={() => navigate("/students?status=VENCIDO")}>
          <span className="card-label">Vencidos</span>
          <span className="card-value">{summary.vencidos}</span>
        </div>

        <div className="card nopayments" onClick={() => navigate("/students?status=SIN_PAGOS")}>
          <span className="card-label">Sin pagos</span>
          <span className="card-value">{summary.sinPagos}</span>
        </div>
      </div>
      <div className="total-month">
          <span>Total mes</span>
          <span>${Number(summary.totalMes).toLocaleString("es-AR")}</span>
        </div>
    </div>
  );
}
