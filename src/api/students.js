import { BASE_URL } from "./config";

export async function getStudents(status) {
  const url = status
    ? `${BASE_URL}/students?status=${status}`
    : `${BASE_URL}/students`;

  const res = await fetch(url);
  return res.json();
}


export async function getStudentById(id) {
  const res = await fetch(`${BASE_URL}/students/${id}`);
  if (!res.ok) throw new Error("Error al obtener alumno");
  return res.json();
}

export async function getStudentSummary() {
  const res = await fetch(`${BASE_URL}/students/summary`);
  if (!res.ok) throw new Error("Error al obtener resumen");
  return res.json();
}

export async function createStudent(student) {
  const res = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });

  if (!res.ok) throw new Error("Error al crear alumno");
  return res.json();
}

export async function updateStudent(id, student) {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });
  if (!res.ok) throw new Error("Error al actualizar alumno");
  return res.json();
}

export async function deleteStudent(id) {
  await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE"
  });
}