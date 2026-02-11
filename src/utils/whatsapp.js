export function getWhatsappLink(phone, name) {
  // Limpiamos el número: quitamos todo lo que no sea número
  const cleanPhone = phone.replace(/\D/g, '');
  
  const message = `Hola ${name}, te aviso que tu cuota mensual se encuentra vencida. ¡Gracias!
Iron City.`;
  
  // En Argentina, el formato para wa.me suele ser 549 + código de área + número sin el 15
  // Si el phone ya viene con 549, lo dejamos, si no, se lo agregamos
  const finalPhone = cleanPhone.startsWith('54') ? cleanPhone : `549${cleanPhone}`;

  return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
}