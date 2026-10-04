import React, { useRef, useState } from 'react';
import { ArrowRight, BedDouble, CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { today, shortDate } from './model.js';
import { shiftMonth } from './finance.js';
import { dayAvailability, monthDays } from './calendar.js';
import './calendar-month.css';

export default function CalendarV2({ state, newBooking, onEdit, renderTimeline }) {
  const [mode, setMode] = useState('month');
  const [period, setPeriod] = useState(() => today().slice(0, 7));
  const [selected, setSelected] = useState(today);
  const [roomId, setRoomId] = useState('');
  const dayDetail = useRef(null);
  const days = monthDays(period);
  const selectedRoom = state.rooms.some(room => room.id === roomId) ? roomId : '';
  const availability = dayAvailability(state, selected, selectedRoom);
  const fullDate = date => new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(new Date(`${date}T12:00:00Z`));
  const selectDay = (date, reveal = false) => {
    setSelected(date); setPeriod(date.slice(0, 7));
    if (reveal && window.matchMedia('(max-width:600px)').matches) requestAnimationFrame(() => dayDetail.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth', block: 'start' }));
  };
  const moveMonth = amount => { const next = shiftMonth(period, amount); setPeriod(next); setSelected(`${next}-01`); };
  const row = (booking, label) => <button key={booking.id} className="month-guest" onClick={() => onEdit(booking)}><span className="month-guest-icon"><BedDouble size={17}/></span><span><strong>{booking.name}</strong><small>{state.rooms.find(room => room.id === booking.roomId)?.name} · {label || `${shortDate(booking.from)} – ${shortDate(booking.to)}`}</small></span><ArrowRight size={16}/></button>;
  return <>
    <div className="month-view-switch" role="group" aria-label="Naptár nézete"><button aria-pressed={mode === 'month'} onClick={() => setMode('month')}>Havi nézet</button><button aria-pressed={mode === 'rooms'} onClick={() => setMode('rooms')}>Szobánként · 14 nap</button></div>
    {mode === 'rooms' ? renderTimeline() : <>
      <div className="page-heading"><div><div className="eyebrow">KI ÉRKEZIK? MELYIK SZOBA SZABAD?</div><h1>A foglalási naptárad</h1><p>Válassz egy napot. Alatta látod a vendégeket és a szabad szobákat.</p></div><button className="btn" onClick={() => newBooking()}><Plus size={17}/>Új foglalás</button></div>
      <div className="month-toolbar"><div><button className="icon-btn" aria-label="Előző hónap" onClick={() => moveMonth(-1)}><ChevronLeft size={20}/></button><h2 aria-live="polite">{new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'long' }).format(new Date(`${period}-01T12:00:00Z`))}</h2><button className="icon-btn" aria-label="Következő hónap" onClick={() => moveMonth(1)}><ChevronRight size={20}/></button><button className="mini-btn" onClick={() => selectDay(today())}>Ma</button></div><label><span>Szoba vagy kiadó ház</span><select aria-label="Naptár szobaszűrője" value={selectedRoom} onChange={event => setRoomId(event.target.value)}><option value="">Összes szoba / ház</option>{state.rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}</select></label></div>
      {state.rooms.length ? <>
        <div className="month-calendar" role="group" aria-label="Havi foglalási naptár"><div className="month-weekdays">{['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'].map(day => <span key={day}>{day}</span>)}</div><div className="month-days">{days.map(date => {
          const info = dayAvailability(state, date, selectedRoom);
          return <button key={date} className={`month-day ${date.startsWith(period) ? '' : 'outside'} ${info.free.length ? 'has-free' : 'full'} ${date === today() ? 'is-today' : ''}`} aria-pressed={selected === date} aria-label={`${fullDate(date)}, ${info.stays.length} foglalt, ${info.free.length} szabad szoba`} onClick={() => selectDay(date, true)}><span className="month-day-number">{Number(date.slice(-2))}{date === today() && <small>Ma</small>}</span><span className="month-day-capacity">{info.free.length ? `${info.free.length} szabad` : 'Tele'}</span><span className="month-day-bookings">{info.stays.slice(0, 2).map(booking => <span key={booking.id}>{booking.name}</span>)}{info.stays.length > 2 && <small>+{info.stays.length - 2} vendég</small>}</span><span className="month-day-dots" aria-hidden="true">{info.stays.slice(0, 4).map(booking => <i key={booking.id}/>)}</span></button>;
        })}</div></div>
        <p className="month-legend"><span><i/>Van szabad szoba</span><span><i/>Minden szoba foglalt</span><span>A távozás napja újra foglalható.</span></p>
        <section ref={dayDetail} className="panel month-day-detail" aria-label="Kiválasztott nap vendégei"><div className="panel-title"><h2>{fullDate(selected)}</h2><span>{availability.free.length} / {availability.rooms.length} szabad</span></div><div className="month-day-sections"><div><h3>Érkeznek <span>{availability.arrivals.length}</span></h3>{availability.arrivals.length ? availability.arrivals.map(booking => row(booking, 'Ezen a napon érkezik')) : <p className="quiet">Nincs várható érkezés.</p>}<h3>Távoznak <span>{availability.departures.length}</span></h3>{availability.departures.length ? availability.departures.map(booking => row(booking, 'Ezen a napon távozik')) : <p className="quiet">Nincs várható távozás.</p>}</div><div><h3>Itt laknak <span>{availability.stays.length}</span></h3>{availability.stays.length ? availability.stays.map(booking => row(booking)) : <p className="quiet">Erre az éjszakára nincs rögzített foglalás.</p>}<h3>Szabad szobák / házak <span>{availability.free.length}</span></h3>{availability.free.length ? <div className="month-free-rooms">{availability.free.map(room => <button key={room.id} onClick={() => newBooking({ from: selected, roomId: room.id })}><Plus size={15}/>{room.name}<small>{room.capacity} fő</small></button>)}</div> : <p className="quiet">Minden szállásegység foglalt ezen az éjszakán.</p>}</div></div></section>
      </> : <div className="empty"><CalendarDays size={30}/><h3>Add hozzá a szobáidat vagy a kiadó házat</h3><p>A saját szállásegységeidből áll össze a naptár.</p><button className="btn" onClick={() => newBooking()}>Szállás beállítása <ArrowRight size={16}/></button></div>}
      <div className="notice"><CalendarDays size={17}/><span>A naptár a kézzel felvett foglalásokat mutatja. A szabad szobák száma ezek alapján számolódik.</span></div>
    </>}
  </>;
}
