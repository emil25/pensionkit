import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BedDouble, BookOpen, Check, CircleCheck, House, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { DEFAULT_PROPERTY, uid } from './model.js';
import { prepareSetup, setupSteps } from './setup.js';
import './onboarding.css';

function Input({ label, children, ...props }) {
  return <label className="field"><span>{label}</span>{children ? React.cloneElement(children, { 'aria-label': label }) : <input aria-label={label} {...props}/>}</label>;
}
const makeRoom = number => ({ id: uid(), name: '', number: String(number).padStart(2, '0'), capacity: 2, price: '', clean: true });

export function SetupChecklist({ state, onGo, onStart, onBooking }) {
  const steps = setupSteps(state);
  const complete = steps.filter(step => step.done).length;
  if (complete === steps.length) return <section className="setup-ready"><CircleCheck size={20}/><div><strong>A szállásod elindult.</strong><span>A naptárból és a napi áttekintésből már szervezheted a vendégfogadást.</span></div></section>;
  const next = steps.find(step => !step.done);
  const canSetup = !state.rooms.length && !state.bookings.length;
  const action = id => id === 'booking' ? onBooking() : canSetup && ['settings', 'rooms'].includes(id) ? onStart() : onGo(id);
  return <section className="setup-card" aria-labelledby="setup-heading"><div className="setup-card-top"><div><span className="eyebrow">A SAJÁT SZÁLLÁSODDAL INDULSZ</span><h2 id="setup-heading">Indulás, lépésről lépésre.</h2><p>Nem kell mindent egyszerre megadnod. A kész lépésekből látod, hol tartasz.</p></div><span className="setup-count">{complete} / {steps.length} kész</span></div><div className="setup-progress" role="progressbar" aria-label="Szállás beállításának állapota" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={complete}><span style={{ width: `${complete / steps.length * 100}%` }}/></div><div className="setup-checks">{steps.map((step, i) => <button key={step.id} onClick={() => action(step.id)} className={step.done ? 'done' : ''}><span>{step.done ? <Check size={15}/> : i + 1}</span><div><strong>{step.title}</strong><small>{step.detail}</small></div><ArrowRight size={15}/></button>)}</div><div className="setup-card-bottom"><span><ShieldCheck size={15}/>A saját adataiddal dolgozol.</span><button className="btn" onClick={() => action(next.id)}>{canSetup && ['settings', 'rooms'].includes(next.id) ? 'Szállásom beállítása' : next.id === 'booking' ? 'Első foglalás felvétele' : 'Vendégtudnivalók megadása'}<ArrowRight size={16}/></button></div></section>;
}

export default function Onboarding({ state, onSave }) {
  const [step, setStep] = useState(0);
  const [p, setP] = useState({ ...DEFAULT_PROPERTY, ...state.property });
  const [rooms, setRooms] = useState(() => [makeRoom(1)]);
  const [kind, setKind] = useState('rooms');
  const [error, setError] = useState('');
  const heading = useRef(null);
  const change = key => e => { setError(''); setP(value => ({ ...value, [key]: e.target.value })); };
  const changeRoom = (id, key) => e => { setError(''); setRooms(list => list.map(room => room.id === id ? { ...room, [key]: e.target.value } : room)); };
  function move(next) { setStep(next); setError(''); requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'nearest' }); }); }
  function submit(e) {
    e.preventDefault();
    try {
      if (step === 0) {
        if (!p.name.trim()) throw new Error('Add meg a szállás nevét.');
        if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) throw new Error('Adj meg érvényes e-mail-címet.');
        move(1);
      } else if (step === 1) {
        prepareSetup(state, p, rooms);
        move(2);
      } else onSave(prepareSetup(state, p, rooms));
    } catch (e) { setError(e.message); }
  }
  const titles = ['Ismerjük meg a szállásodat.', 'Mit adsz ki a vendégeidnek?', 'Amit a vendégeid jó, ha tudnak.'];
  return <form className="setup-wizard" onSubmit={submit}>
    <ol className="setup-wizard-steps" aria-label="Beállítási lépések">{[[House, 'Szállás'], [BedDouble, 'Szobák'], [BookOpen, 'Tudnivalók']].map(([Icon, title], i) => <li key={title} aria-current={step === i ? 'step' : undefined} className={step >= i ? 'active' : ''}><span>{step > i ? <Check size={16}/> : <Icon size={16}/>}</span><strong>{title}</strong></li>)}</ol>
    <h3 ref={heading} tabIndex={-1}>{titles[step]}</h3>
    <p className="setup-intro">{['A nevet és a pénznemet add meg most. A többi adatot később is kiegészítheted.', 'Minden külön foglalható szobát külön vegyél fel. Egy egész ház egyetlen egységként kezelhető.', 'Ezekből készül a vendégútmutatód és az érkezési üzeneted. A WiFi és a többi tudnivaló később is megadható.'][step]}</p>
    {step === 0 && <><Input label="Szállás neve" required maxLength={100} value={p.name} onChange={change('name')} placeholder="Pl. Boróka Vendégház"/><div className="form-grid"><Input label="Pénznem"><select value={p.currency} onChange={change('currency')}><option value="EUR">Euró (EUR)</option><option value="RON">Román lej (RON)</option><option value="HUF">Magyar forint (HUF)</option></select></Input><Input label="Telefon (nem kötelező)" type="tel" value={p.phone} onChange={change('phone')} maxLength={40}/></div><Input label="E-mail (nem kötelező)" type="email" value={p.email} onChange={change('email')} maxLength={180}/><Input label="Cím (nem kötelező)" value={p.address} onChange={change('address')} maxLength={250}/><div className="notice"><ShieldCheck size={16}/><span>A pénznem az árakra és a foglalásokra is érvényes. Az első foglalás előtt még módosíthatod.</span></div></>}
    {step === 1 && <><div className="setup-lodging-kind" role="group" aria-label="Szállásegység típusa"><button type="button" aria-pressed={kind === 'rooms'} onClick={() => setKind('rooms')}><BedDouble size={19}/><span>Szobákat adok ki<small>Panzió vagy vendégház</small></span></button><button type="button" aria-pressed={kind === 'house'} onClick={() => { if (rooms.length > 1) { setError('Több szobát vettél fel. A teljes házhoz hagyj meg egy egységet, vagy maradj a szobánkénti kiadásnál.'); return; } setError(''); setKind('house'); setRooms(list => list.map(room => ({ ...room, name: room.name || 'Teljes ház' }))); }}><House size={19}/><span>Az egész házat adom ki<small>Egyben foglalható</small></span></button></div>{rooms.map((room, i) => <section key={room.id} className="setup-room"><div><strong>{kind === 'house' ? 'A kiadó házad' : `${i + 1}. szoba`}</strong>{rooms.length > 1 && <button type="button" className="icon-btn" aria-label={`${i + 1}. szoba eltávolítása`} onClick={() => { setError(''); setRooms(list => list.filter(item => item.id !== room.id)); }}><Trash2 size={16}/></button>}</div><div className="form-grid"><Input label={`${i + 1}. egység neve`} required maxLength={70} value={room.name} onChange={changeRoom(room.id, 'name')} placeholder={kind === 'house' ? 'Teljes ház' : 'Pl. Fenyő'}/><Input label={`${i + 1}. egység jelölése`} required maxLength={12} value={room.number} onChange={changeRoom(room.id, 'number')}/><Input label={`${i + 1}. egység férőhelye`} required type="number" min="1" max="50" step="1" value={room.capacity} onChange={changeRoom(room.id, 'capacity')}/><Input label={`${i + 1}. egység ára / éj (${p.currency})`} required type="number" min="0" step="0.01" value={room.price} onChange={changeRoom(room.id, 'price')} placeholder="A teljes egység ára"/></div></section>)}{kind === 'rooms' && <button type="button" className="btn secondary setup-add-room" disabled={rooms.length >= 30} onClick={() => { const used = new Set(rooms.map(room => room.number.trim())); let n = 1; while (used.has(String(n).padStart(2, '0'))) n++; setRooms(list => [...list, makeRoom(n)]); setError(''); }}><Plus size={16}/>Másik szoba hozzáadása</button>}<p className="quiet">Az ár a teljes szobára vagy házra, egy éjszakára vonatkozik. A foglalásnál később egyedi árat is megadhatsz.</p></>}
    {step === 2 && <><div className="setup-summary"><CircleCheck size={21}/><div><strong>{p.name.trim()}</strong><span>{rooms.length} {kind === 'house' ? 'kiadó ház' : 'szoba'} · {rooms.reduce((sum, room) => sum + Number(room.capacity), 0)} férőhely · {p.currency}</span></div></div><div className="form-grid"><Input label="Érkezés ettől" type="time" required value={p.checkin} onChange={change('checkin')}/><Input label="Távozás eddig" type="time" required value={p.checkout} onChange={change('checkout')}/><Input label="WiFi-hálózat (nem kötelező)" maxLength={100} value={p.wifiName} onChange={change('wifiName')}/><Input label="WiFi-jelszó (nem kötelező)" maxLength={100} value={p.wifiPass} onChange={change('wifiPass')}/></div><Input label="Parkolás (nem kötelező)"><textarea maxLength={1500} rows={2} value={p.parking} onChange={change('parking')} placeholder="Hol parkolhatnak a vendégeid?"/></Input><Input label="Házirend (nem kötelező)"><textarea maxLength={3000} rows={3} value={p.rules} onChange={change('rules')} placeholder="Csendes időszak, dohányzás, háziállatok…"/></Input><div className="notice"><ShieldCheck size={16}/><span>A befejezéssel a saját munkaterületedre kerülnek az adatok. A vendégútmutató ettől még nem lesz nyilvános.</span></div></>}
    {error && <div className="notice error" role="alert">{error}</div>}
    <div className="setup-wizard-actions">{step > 0 ? <button type="button" className="btn secondary" onClick={() => move(step - 1)}><ArrowLeft size={15}/>Vissza</button> : <span>1 / 3 lépés</span>}<button className="btn" type="submit">{step === 2 ? 'Szállás létrehozása' : 'Tovább'}{step === 2 ? <Check size={16}/> : <ArrowRight size={16}/>}</button></div><p className="setup-save-note">A megadott adatokat a „Szállás létrehozása” gombbal mented el. Bezáráskor a félkész beállítás nem mentődik.</p>
  </form>;
}
