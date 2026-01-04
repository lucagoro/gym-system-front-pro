import { BASE_URL } from "./config";

export async function createPaymentForStudent(studentId, payment) {
  const res = await fetch(`${BASE_URL}/students/${studentId}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment)
  });

  if (!res.ok) throw new Error("Error al registrar pago");
  return res.json();
}

export async function getPaymentsByStudent(studentId) {
  const res = await fetch(`${BASE_URL}/students/${studentId}/payments`);
  if (!res.ok) throw new Error("Error al obtener pagos");
  return res.json();
}