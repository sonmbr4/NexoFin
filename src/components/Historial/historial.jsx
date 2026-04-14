// components/Historial/historial.jsx
import React from 'react';
import './Historial.css';

export const Historial = ({ historial, onEliminarTransaccion, limite = 5 }) => {
  // ========== FUNCIONES AUXILIARES ==========
  const formatearMonto = (monto, tipo) => {
    const simbolo = tipo === 'ingreso' ? '+' : '-';
    return `${simbolo} $${monto.toFixed(2)}`;
  };

  const historialLimitado = historial.slice(0, limite);
  const transaccionesOcultas = historial.length - limite;

  // ========== RENDER ==========
  return (
    <div className="historial-container">
      <h2>📋 Historial de Transacciones</h2>
      
      {transaccionesOcultas > 0 && (
        <p className="historial-ocultas">
          Mostrando últimas {limite} transacciones 
          ({transaccionesOcultas} más no mostradas)
        </p>
      )}
      
      {historialLimitado.length === 0 ? (
        <p className="historial-vacio">No hay transacciones registradas</p>
      ) : (
        <ul className="historial-lista">
          {historialLimitado.map((transaccion) => (
            <li 
              key={transaccion.id} 
              className={`historial-item ${transaccion.tipo}`}
              style={{ borderLeftColor: transaccion.categoriaColor }}
            >
              <div className="historial-info">
                <div className="historial-categoria">
                  <span className="categoria-icono">{transaccion.categoriaIcono}</span>
                  <span className="historial-descripcion">
                    {transaccion.descripcion}
                  </span>
                </div>
                <span className="historial-fecha">
                  {transaccion.fecha}
                </span>
              </div>
              
              <div className="historial-monto-acciones">
                <span className={`historial-monto ${transaccion.tipo}`}>
                  {formatearMonto(transaccion.monto, transaccion.tipo)}
                </span>
                
                <button 
                  className="btn-eliminar"
                  onClick={() => onEliminarTransaccion(
                    transaccion.id, 
                    transaccion.tipo, 
                    transaccion.monto
                  )}
                  title="Eliminar transacción"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};