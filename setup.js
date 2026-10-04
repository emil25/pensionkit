import { DEFAULT_PROPERTY, validateState } from './model.js';

export function setupSteps(state) {
  const p = state.property;
  return [
    { id: 'settings', title: 'Szállásadatok', detail: 'Név és alapbeállítások.', done: !!p.name.trim() },
    { id: 'rooms', title: 'Szobák vagy kiadó ház', detail: 'Férőhely és éjszakánkénti ár.', done: state.rooms.length > 0 },
    { id: 'guide', title: 'Első vendégtudnivalók', detail: 'WiFi, parkolás vagy házirend.', done: ['wifiName', 'breakfast', 'parking', 'rules'].some(key => p[key].trim()) },
    { id: 'booking', title: 'Első foglalás', detail: 'Vendég, időpont és szállásdíj.', done: state.bookings.length > 0 },
  ];
}

// Setup creates the first rooms only. Existing reservations must never be replaced.
export function prepareSetup(state, property, rooms) {
  if (state.rooms.length || state.bookings.length) throw new Error('A szállásodat már elindítottad. A meglévő adatokat a Beállítások és a Szobák menüben módosíthatod.');
  const p = { ...state.property };
  for (const key of Object.keys(DEFAULT_PROPERTY)) {
    const value = property[key] ?? p[key];
    if (typeof value !== 'string') throw new Error('Ellenőrizd a szállás adatait.');
    p[key] = value.trim();
  }
  if (!p.name) throw new Error('Add meg a szállás nevét.');
  if (!['EUR', 'HUF', 'RON'].includes(p.currency)) throw new Error('Válassz pénznemet.');
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) throw new Error('Adj meg érvényes e-mail-címet.');
  if (![p.checkin, p.checkout].every(time => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time))) throw new Error('Ellenőrizd az érkezési és távozási időt.');
  if (!Array.isArray(rooms) || !rooms.length) throw new Error('Adj hozzá legalább egy szobát vagy kiadó házat.');
  const nextRooms = rooms.map(room => {
    const capacity = Number(room.capacity);
    const price = Number(room.price);
    if (!room.name?.trim() || !room.number?.trim()) throw new Error('Minden szobának adj nevet és jelölést.');
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 50) throw new Error('A férőhely 1 és 50 közötti egész szám legyen.');
    if (room.price === '' || !Number.isFinite(price) || price < 0) throw new Error('Adj meg érvényes, nem negatív éjszakánkénti árat.');
    return { id: room.id, name: room.name.trim(), number: room.number.trim(), capacity, price, clean: true };
  });
  if (new Set(nextRooms.map(room => room.number)).size !== nextRooms.length) throw new Error('A szobák jelölése legyen különböző.');
  const next = { ...state, property: p, rooms: nextRooms };
  if (!validateState(next)) throw new Error('A megadott adatok nem menthetők. Ellenőrizd a szobákat és a szállásadatokat.');
  return next;
}
