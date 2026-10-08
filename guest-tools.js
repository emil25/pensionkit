export function phoneNumber(value = '') {
  const raw = String(value).trim().replace(/[\s().-]/g, '');
  const normalized = raw.startsWith('00') ? '+' + raw.slice(2) : raw;
  return /^\+[1-9]\d{6,14}$/.test(normalized) ? normalized : '';
}
export function whatsappUrl(phone, text) {
  const number = phoneNumber(phone);
  return number ? `https://wa.me/${number.slice(1)}?text=${encodeURIComponent(text)}` : '';
}
export function roomRemovalError(state, roomId) {
  return state.bookings.some(booking => booking.roomId === roomId)
    ? 'Ehhez a szobához foglalás tartozik. A korábbi vendégadatok megőrzéséhez a szoba nem törölhető.' : '';
}
