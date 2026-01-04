import "../css/StudentList.css";
import StudentCard from './StudentCard';

export default function StudentList({ students }) {
    return (
        <ul className='student-list'>
            {students.map(student => (
                <StudentCard
                    key={student.id}
                    student={student}
                />
            ))}
        </ul>
    );
}