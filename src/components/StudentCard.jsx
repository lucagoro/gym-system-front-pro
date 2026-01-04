import "../css/StudentCard.css";
import { useNavigate } from "react-router-dom";

export default function StudentCard({ student }) {
    const navigate = useNavigate();
  return (
    <li className="student-card">
      <div className="student-info">
        <span className="student-name">
          {student.surname} {student.name}
        </span>
        <span className={`student-status status-${student.status}`}>
          {student.status.replace("_", " ")}
        </span>
      </div>

      <div className="student-actions">
        <button className="btn" onClick={() => navigate(`/students/${student.id}`)}>
            Ver
        </button>
      </div>
    </li>
  );
}
