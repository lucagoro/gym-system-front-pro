import "../css/StudentCard.css";
import { useNavigate } from "react-router-dom";
import { getWhatsappLink } from "../utils/whatsapp";

export default function StudentCard({ student }) {
    const navigate = useNavigate();

    function isExpired(status) {
        return status === "VENCIDO";
    }

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
        {isExpired(student.status) && (
        <a
          href={getWhatsappLink(student.phone, student.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp-icon"
        >
          <img src="/whatsapp.svg" alt="WhatsApp" />
        </a>
      )}
      </div>
    </li>
  );
}
