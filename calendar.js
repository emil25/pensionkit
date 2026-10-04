import { activeBooking, addDays } from './model.js';

export function monthDays(period) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period)) throw new Error('Invalid month');
  const first = `${period}-01`;
  const weekday = (new Date(`${first}T12:00:00Z`).getUTCDay() + 6) % 7;
  const start = addDays(first, -weekday);
  const next = new Date(`${first}T12:00:00Z`);
  next.setUTCMonth(next.getUTCMonth() + 1);
  next.setUTCDate(0);
  const count = Math.ceil((weekday + next.getUTCDate()) / 7) * 7;
  return Array.from({ length: count }, (_, index) => addDays(start, index));
}

export function dayAvailability(state, date, roomId = '') {
  const rooms = state.rooms.filter(room => !roomId || room.id === roomId);
  const relevant = state.bookings.filter(booking => rooms.some(room => room.id === booking.roomId) && activeBooking(booking));
  const stays = relevant.filter(booking => booking.from <= date && booking.to > date);
  const arrivals = relevant.filter(booking => booking.from === date);
  // Include already checked-out guests in the day's departure history.
  const departures = state.bookings.filter(booking => booking.status !== 'cancelled' && rooms.some(room => room.id === booking.roomId) && booking.to === date);
  const free = rooms.filter(room => !stays.some(booking => booking.roomId === room.id));
  return { rooms, stays, arrivals, departures, free };
}
