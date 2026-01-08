export function getWhatsappLink(phone, name) {
  const message = `Hola ${name},
Te aviso que tu cuota mensual se encuentra vencida.
Cualquier cosa avisame y lo vemos.
¡Gracias!`;

  return `https://wa.me/549${phone}?text=${encodeURIComponent(message)}`;
}
