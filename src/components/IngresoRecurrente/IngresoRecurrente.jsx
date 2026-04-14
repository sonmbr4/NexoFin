// components/IngresoRecurrente/IngresoRecurrente.jsx
import React, { useState } from 'react';
import { ModalIngresoRecurrente } from './ModalIngresoRecurrente';
import { useIngresosRecurrentes } from '../../Logic/useIngresosRecurrentes';
import './IngresoRecurrente.css';

export const IngresoRecurrente = () => {
  // ========== ESTADOS ==========
  const [modalAbierto, setModalAbierto] = useState(false);
  
  // ========== HOOKS ==========
  const {
    ingresoRecurrente,
    guardarIngresoRecurrente,
    desactivarIngresoRecurrente,
    activarIngresoRecurrente,
    eliminarIngresoRecurrente
  } = useIngresosRecurrentes();

  // ========== RENDER ==========
  return (
    <>
      {/* Botón flotante */}
      <button 
        className={`btn-ingreso-recurrente ${ingresoRecurrente?.activo ? 'activo' : ''}`}
        onClick={() => setModalAbierto(true)}
        title={ingresoRecurrente ? 'Configurar ingreso recurrente' : 'Agregar ingreso recurrente'}
      >
        <span className="btn-icono">
          {ingresoRecurrente?.activo ? '⚙️' : '⚙️'}
        </span>
        {ingresoRecurrente?.activo && (
          <span className="btn-indicador" title="Ingreso recurrente activo">
            •
          </span>
        )}
      </button>

      {/* Modal */}
      <ModalIngresoRecurrente 
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGuardar={guardarIngresoRecurrente}
        ingresoActual={ingresoRecurrente}
        onDesactivar={desactivarIngresoRecurrente}
        onActivar={activarIngresoRecurrente}
        onEliminar={eliminarIngresoRecurrente}
      />
    </>
  );
};