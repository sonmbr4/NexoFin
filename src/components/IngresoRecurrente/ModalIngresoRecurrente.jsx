// components/IngresoRecurrente/ModalIngresoRecurrente.jsx
import React, { useState, useEffect } from 'react';
import './IngresoRecurrente.css';

export const ModalIngresoRecurrente = ({ 
  isOpen, 
  onClose, 
  onGuardar, 
  ingresoActual,
  onDesactivar,
  onActivar,
  onEliminar 
}) => {
  // ========== ESTADOS ==========
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('mensual');
  const [fechaProximoPago, setFechaProximoPago] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // ========== CARGAR DATOS EXISTENTES ==========
  useEffect(() => {
    if (ingresoActual) {
      setMonto(ingresoActual.monto.toString());
      setTipo(ingresoActual.tipo);
      setFechaProximoPago(ingresoActual.proximoPago.split('T')[0]);
    } else {
      // Valores por defecto
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      setFechaProximoPago(manana.toISOString().split('T')[0]);
    }
  }, [ingresoActual, isOpen]);

  // ========== FUNCIONES ==========
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const config = {
      monto: parseFloat(monto),
      tipo,
      proximoPago: new Date(fechaProximoPago).toISOString()
    };
    
    onGuardar(config);
    onClose();
  };

  const handleEliminar = () => {
    if (window.confirm('¿Estás seguro de eliminar el ingreso recurrente?')) {
      onEliminar();
      onClose();
    }
  };

  const calcularProximaFecha = () => {
    if (!fechaProximoPago) return null;
    
    const fecha = new Date(fechaProximoPago);
    
    if (tipo === 'mensual') {
      fecha.setMonth(fecha.getMonth() + 1);
    } else if (tipo === 'quincenal') {
      fecha.setDate(fecha.getDate() + 15);
    }
    
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {ingresoActual ? '⚙️ Configurar Ingreso' : '⚙️ Nuevo Ingreso Recurrente'}
          </h2>
          <button className="btn-cerrar" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Estado actual si existe */}
            {ingresoActual && (
              <div className="estado-actual">
                <div className="estado-badge" data-activo={ingresoActual.activo}>
                  {ingresoActual.activo ? '🟢 Activo' : '🔴 Inactivo'}
                </div>
                {ingresoActual.activo ? (
                  <button 
                    type="button" 
                    className="btn-desactivar"
                    onClick={onDesactivar}
                  >
                    Pausar
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="btn-activar"
                    onClick={onActivar}
                  >
                    Activar
                  </button>
                )}
              </div>
            )}

            {/* Monto */}
            <div className="form-group">
              <label htmlFor="monto">Monto del ingreso</label>
              <div className="input-con-icono">
                <span className="simbolo-moneda">$</span>
                <input
                  id="monto"
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>

            {/* Tipo de recurrencia */}
            <div className="form-group">
              <label>Frecuencia</label>
              <div className="opciones-tipo">
                <label className={`opcion-tipo ${tipo === 'mensual' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    value="mensual"
                    checked={tipo === 'mensual'}
                    onChange={(e) => setTipo(e.target.value)}
                  />
                  <span className="opcion-icono">📅</span>
                  <span className="opcion-texto">Mensual</span>
                </label>
                
                <label className={`opcion-tipo ${tipo === 'quincenal' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    value="quincenal"
                    checked={tipo === 'quincenal'}
                    onChange={(e) => setTipo(e.target.value)}
                  />
                  <span className="opcion-icono">📆</span>
                  <span className="opcion-texto">Quincenal</span>
                </label>
              </div>
            </div>

            {/* Fecha próximo pago */}
            <div className="form-group">
              <label htmlFor="fecha">Fecha del próximo pago</label>
              <input
                id="fecha"
                type="date"
                value={fechaProximoPago}
                onChange={(e) => setFechaProximoPago(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Vista previa */}
            {monto && fechaProximoPago && (
              <div className="vista-previa">
                <h3>📋 Vista previa</h3>
                <p>Se agregará <strong>${parseFloat(monto).toLocaleString()}</strong> cada {tipo === 'mensual' ? 'mes' : '15 días'}</p>
                <p>Próximo pago: <strong>{new Date(fechaProximoPago).toLocaleDateString('es-ES')}</strong></p>
                {calcularProximaFecha() && (
                  <p>Siguiente después: <strong>{calcularProximaFecha()}</strong></p>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            
            {ingresoActual && (
              <button 
                type="button" 
                className="btn-eliminar"
                onClick={handleEliminar}
              >
                Eliminar
              </button>
            )}
            
            <button type="submit" className="btn-guardar">
              {ingresoActual ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};