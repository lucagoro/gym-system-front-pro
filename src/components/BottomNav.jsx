import "../css/BottomNav.css";
import { NavLink } from "react-router-dom";

export default function BottomNav() {

    return (
        <div className="bottom-nav-container">
            <nav className="bottom-nav">
                <NavLink to="/" end className="nav-item">Resumen</NavLink>
                <NavLink to="/students" className="nav-item">Alumnos</NavLink>
            </nav>
        </div>
    );
}