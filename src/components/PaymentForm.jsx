import { useState } from "react";

export default function PaymentForm({ onSubmit, onCancel }) {
  const today = new Date().toISOString().split("T")[0];
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(today);
  const [period, setPeriod] = useState("");
  

  function handleSubmit(e) {
    e.preventDefault(); // Evita recargar la página
    onSubmit({          // Envía los datos del formulario al componente padre y el componente padre se encarga de llamar a la API
      amount: Number(amount),
      paymentDate: paymentDate,
      period
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Periodo (ej: Diciembre 2025)"
        value={period}
        onChange={e => setPeriod(e.target.value)}
        required
      />

      <input
        type="date"
        placeholder="Fecha de pago"
        value={paymentDate}
        onChange={e => setPaymentDate(e.target.value)}
        required
      />

      <div className="btns-form">
        <button className="btn-save" type="submit">Guardar</button>
        <button className="btn-cancel" type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
