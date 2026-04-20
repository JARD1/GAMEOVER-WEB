const DEFAULT_WHATSAPP_NUMBER = "584242518228";

export function buildWhatsAppLink(phoneNumber, product) {
  const normalizedPhone = String(phoneNumber || DEFAULT_WHATSAPP_NUMBER).replace(/[^\d]/g, "");
  const hasPrice = product.price !== undefined && product.price !== null && product.price !== "";
  const message = hasPrice
    ? `Hola, quiero informacion sobre ${product.title} de ${product.price}$`
    : `Hola, quiero informacion sobre ${product.title}`;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
