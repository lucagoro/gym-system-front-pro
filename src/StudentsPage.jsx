import { useState, useEffect } from "react";
import StudentList from "./components/StudentList";
import SearchBar from "./components/SearchBar";
import "./css/StudentFilter.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getStudents } from "./api/students";

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");
    const navigate = useNavigate();

useEffect(() => {
  getStudents(status).then(setStudents);
}, [status]);

    const filteredStudents = students.filter(student =>
    `${student.name} ${student.surname}`
        .toLowerCase()
        .includes(search.toLowerCase())
);

   return (
        <div>
            <SearchBar value={search} onChange={setSearch} />
            <h2>Alumnos</h2>
            <StudentList students={filteredStudents} />
            <button className="btn-add-student" onClick={() => navigate("/students/add")}> + </button>
        </div>
    );
}