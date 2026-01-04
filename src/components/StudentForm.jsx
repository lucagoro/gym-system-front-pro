import { useState, useEffect } from "react";

export default function StudentForm({initialData, onSubmit, onCancel}) {
    const [form, setForm] = useState({
        name: "",
        surname: "",
        phone: ""
    }); 

    useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        surname: initialData.surname,
        phone: initialData.phone
      });
    }
  }, [initialData]);

    function handleChange(e) {
        setForm({...form, [e.target.name]: e.target.value });
   }

   async function handleSubmit(e) {
        e.preventDefault();
        onSubmit(form);
   }

    return (
        <form onSubmit={handleSubmit}>
      <input
        name="surname"
        placeholder="Apellido"
        value={form.surname}
        onChange={handleChange}
        required
      />

      <input
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="phone"
        placeholder="Teléfono"
        value={form.phone}
        onChange={handleChange}
        required
      />

      <div className="btns-form">
        <button type="submit" className="btn-register">Guardar</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
    );
}