import "../css/Header.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="header">
            <button className="btn-resumen" onClick={() => navigate("")}>Resumen</button>
            <button className="btn-alumnos" onClick={() => navigate("/students")}>Alumnos</button>
        </header>
    );
}