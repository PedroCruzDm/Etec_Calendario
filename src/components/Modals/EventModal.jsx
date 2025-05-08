import React, { useState } from "react";
import { db } from './../../hooks/FireBase/firebaseconfig.js';
import { doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import './Styles/style.css';

// Função segura para converter qualquer tipo de data
const toISOStringSafe = (date) => {
  if (date?.toDate) return date.toDate().toISOString().slice(0, 16); // Firebase Timestamp
  if (typeof date === 'string') return new Date(date).toISOString().slice(0, 16); // String
  if (date instanceof Date) return date.toISOString().slice(0, 16); // Date
  return "";
};

const EventModal = ({ event, onClose, onDeleteEvento, onUpdateEvento }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [type, setType] = useState(event.type);
  const [desc, setDesc] = useState(event.desc);
  const [start, setStart] = useState(toISOStringSafe(event.start));
  const [end, setEnd] = useState(toISOStringSafe(event.end));
  const [important, setImportant] = useState(event.important);
  const [color, setColor] = useState(event.color || '#00aaff');

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "eventos", event.id);
      await deleteDoc(docRef);

      if (onDeleteEvento) onDeleteEvento(event.id);
      onClose();
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
    }
  };

  const handleUpdate = async () => {
    const updatedEvent = {
      ...event,
      title,
      type,
      desc,
      start,
      end,
      important,
      color,
    };

    try {
      const docRef = doc(db, "eventos", event.id);
      await updateDoc(docRef, updatedEvent);

      if (onUpdateEvento) {
        onUpdateEvento({
          ...updatedEvent,
          start: new Date(start),
          end: new Date(end),
        });
      }

      onClose();
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
    }
  };

  return (
    <div className="modal_event">
      <div className="modal_event_container">
        <div className="modal_event_header">
          <h2>{isEditing ? "Editar Evento" : event.title}</h2>
          <button onClick={onClose} className="modal_event_close">X</button>
        </div>

        <div className="modal_event_body">
          {isEditing ? (
            <>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />

              <select value={type} onChange={e => setType(e.target.value)} required>
                <option value="Reunião">Reunião</option>
                <option value="Tarefa">Tarefa</option>
                <option value="Evento">Evento</option>
                <option value="Sabado Letivo">Sábado Letivo</option>
                <option value="Outro">Outro</option>
              </select>

              <textarea value={desc} onChange={e => setDesc(e.target.value)} required></textarea>

              <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} required />
              <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} required />

              <select value={important} onChange={e => setImportant(e.target.value)} required>
                <option value="n/a">N/A</option>
                <option value="Leve">Leve</option>
                <option value="Moderado">Moderado</option>
                <option value="Importante">Importante</option>
                <option value="Urgente">Urgente</option>
              </select>

              <p>Escolha a cor do evento:</p>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} required />
            </>
          ) : (
            <>
              <p>Tipo: {event.type}</p>
              <p>Descrição: {event.desc}</p>
              
              <p>Início: {new Date(event.start).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "America/Sao_Paulo",
                })}</p>

              <p>Fim: {new Date(event.end).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "America/Sao_Paulo",
                })}</p>
              <br></br>
            </>
          )}
        </div>

        <div className="modal_event_buttons">
          {isEditing ? (
            <>
              <button className="modal_event_save" onClick={handleUpdate}>Salvar Alterações</button>
              <button className="modal_event_cancel" onClick={() => setIsEditing(false)}>Cancelar</button>
            </>
          ) : (
            <>
              <button className="modal_event_edit" onClick={() => setIsEditing(true)}>Editar</button>
              <button className="modal_event_delete" onClick={handleDelete}>Excluir</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;