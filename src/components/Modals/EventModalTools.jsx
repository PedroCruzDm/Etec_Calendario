import React from "react";

const EventModalTools = ({ onClose }) => {
    return(
        <div className="event-modal-tools">
            <div className="event-modal-tools-header">
                <h2>Ferramentas</h2>
                <button className="close-button" onClick={onClose}>X</button>
            </div>

            <div className="event-modal-tools-body">
                <ul>
                    <li>
                        <button className="btn btn-primary">Adicionar Evento</button>
                    </li>
                    <li>
                        <button className="btn btn-secondary">Editar Evento</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default EventModalTools;