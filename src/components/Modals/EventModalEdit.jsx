import React, { useState } from "react";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../hooks/FireBase/firebaseconfig";
import { updateEvento} from "../../hooks/Calendario/updateEvento";

const EventModalEdit = ({ event, onClose, onUpdateEvento }) => {
  const [title, setTitle] = useState(event.title);
  const [type, setType] = useState(event.type);
  const [desc, setDesc] = useState(event.desc);
  const [start, setStart] = useState(typeof event.start === "string"? event.start: new Date(event.start.seconds ? event.start.seconds * 1000 : event.start).toISOString().slice(0, 16));
  const [end, setEnd] = useState(typeof event.end === "string"? event.end: new Date(event.end.seconds ? event.end.seconds * 1000 : event.end).toISOString().slice(0, 16)
);
  const [important, setImportant] = useState(event.important);
  const [color, setColor] = useState(event.color || "#00aaff");



  return (
    <div className="modal_event">
      <div className="modal_event_container">
        <div className="modal_event_header">
          <h2>Editar Evento</h2>
          <button onClick={onClose} className="modal_event_close">X</button>
        </div>

        <div className="modal_event_body">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required/>

          <select value={type} onChange={e => setType(e.target.value)} required>
            <option value="Reunião">Reunião</option>
            <option value="Tarefa">Tarefa</option>
            <option value="Evento">Evento</option>
            <option value="Sabado Letivo">Sábado Letivo</option>
            <option value="Outro">Outro</option>
          </select>

          <textarea value={desc} onChange={e => setDesc(e.target.value)} required></textarea>

          <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)}required/>
          <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} required/>

          <select value={important} onChange={e => setImportant(e.target.value)}required>
            <option value="n/a">N/A</option>
            <option value="Leve">Leve</option>
            <option value="Moderado">Moderado</option>
            <option value="Importante">Importante</option>
            <option value="Urgente">Urgente</option>
          </select>

          <p>Escolha a cor do evento:</p>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} required/>

          <div className="modal_event_buttons">
            <button className="modal_event_save" onClick={handleUpdate}>Atualizar</button>
            <button className="modal_event_cancel" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModalEdit;