import React, { useCallback, useMemo, useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'moment/locale/pt-br';
import EventModal from '../Modals/EventModal.jsx';
import EventModalAdd from '../Modals/EventModalAdd.jsx';
import { eventos, fetchEventos } from './../../hooks/Calendario/Eventos.js';
import { collection, addDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"; // <- agora está correto
import { db } from '../../hooks/FireBase/firebaseconfig.js';
import './Style/calendario.css';

const DragAndDrop = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function Calendario() {
  const [events, setEvents] = useState(eventos); //Iniciando com os eventos
  const [eventsSelected, setEventsSelected] = useState(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate])
  const onView = useCallback((newView) => setView(newView), [setView])

  React.useEffect(() => {
    const carregarEventos = async () => {
      const dados = await fetchEventos();
      const eventosConvertidos = dados.map(evento => ({
        ...evento,
        start: new Date(evento.start),
        end: new Date(evento.end),
      }));
      setEvents(eventosConvertidos);
    };
    carregarEventos();
  }, []);
  
  const onEventDrop = async (data) => {
    const { start, end } = data;
    const updatedEvents = events.map((event) => {
      if (event.id === data.event.id) {
        return { 
          ...event, 
          start: new Date(start),
          end: new Date(end),
        };
      }
      return event;
    });
    setEvents(updatedEvents);

    try {
      const eventToUpdate = updatedEvents.find(event => event.id === data.event.id);
      if (eventToUpdate) {
        const eventDocRef = doc(db, "eventos", eventToUpdate.id);
        await updateDoc(eventDocRef, {
          start: eventToUpdate.start,
          end: eventToUpdate.end,
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao salvar evento no Firestore:", error);
    }
  };
  

  const onEventResize = async (data) => {
    const { start, end } = data;
    const updatedEvents = events.map((event) => {
      if (event.id === data.event.id) {
        return { ...event, start, end };
      }
      return event;
    });
    setEvents(updatedEvents);

    try {
      const eventToUpdate = updatedEvents.find(event => event.id === data.event.id);
      if (eventToUpdate) {
        const eventDocRef = doc(db, "eventos", eventToUpdate.id);
        await updateDoc(eventDocRef, {
          start: eventToUpdate.start,
          end: eventToUpdate.end,
        });
        window.location.reload(); // Atualiza a página após a atualização do evento
      }
    } catch (error) {
      console.error("Erro ao atualizar evento no Firestore:", error);
    }
  };

  const handleEventSelect = (event) => {
    setEventsSelected(event);
  };

  const handleEventClose = () => {
    setEventsSelected(null);
    window.location.reload();
  };

  const AdicionarEvent = (slotInfo) => {
    
    const newEvent = {
      id: events.length + 1,
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      color: '',
      type: '',
      important: '',
      desc: '',
    };
    setEvents([...events, newEvent]);
    setEventsSelected(newEvent);
    
  };

  const mensagem_traduzir = useMemo(() => ({
    allDay: 'Dia inteiro',
    previous: 'Anterior',
    next: 'Proximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Horário',
    event: 'Evento',
    noEventsInRange: 'Nenhum evento encontrado ',
  }), []);

  const finaisSemana = useCallback((date) => {
    const cor_fim_de_semana = 'rgba(236, 17, 17, 0.09)';
    if (moment(date).day() === 0) {
      return { className: 'sunday', style: { backgroundColor: cor_fim_de_semana, color: 'black' } };
    }
    if (moment(date).day() === 6) {
      return { className: 'saturday', style: { backgroundColor: cor_fim_de_semana, color: 'black' } };
    }
    return {};
  }, []);

  return (
    <div style={{ width: '100%', marginBottom: 20 }}>
      <DragAndDrop
        localizer={localizer}
        defaultDate={moment().toDate()}
        defaultView="month"
        dayPropGetter={finaisSemana}
        messages={mensagem_traduzir}
        date={date}
        onNavigate={onNavigate}
        onView={onView}
        view={view}
        formats={FormatoAgenda.formats}
        views={['month', 'week', 'day', 'agenda']}
        style={{ height: '80vh', fontWeight: 'bold', fontSize: '1rem' }}
        events={events}
        resizable
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        eventPropGetter={EventStyle}
        onDoubleClickEvent={handleEventSelect}
        onSelectEvent={handleEventSelect}
        onUpdateEvent={handleEventSelect}
        selectable
        onSelectSlot={AdicionarEvent}
        className="calendario"
      />

      {eventsSelected && (
        <EventModal event={eventsSelected} onClose={handleEventClose} className="modal_event" />
      )}
      
      {eventsSelected && eventsSelected.title === '' && (
        <EventModalAdd event={eventsSelected} onClose={handleEventClose} className="modal_event" />
      )}
    </div>
  );
}

const EventStyle = (event) => {
  return {
    style: {
      backgroundColor: event.color,
      fontWeight: 'bold',
      fontSize: 20,
    },
  };
};

export default Calendario;

function FormatoAgenda() {
  const { defaultDate, formats, views } = useMemo({
    defaultDate: new Date(2025, 4, 27),
    formats: {
      agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
        localizer.format(start, 'HH:mm', culture) + ' - ' + localizer.format(end, 'HH:mm', culture),
    },
    views: [views.WEEK, views.DAY, views.AGENDA],
    
  });
}