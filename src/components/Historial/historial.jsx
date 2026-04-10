import React from "react";
import "./historial.css";

export const Historial = ({ historial, onEliminarTransaccion, limite = 5 }) => {
  // === Funciones ===

  const formatearMonto = (monto, tipo) => {
    const simbolo = tipo === "ingreso" ? "+" : "-";
    return `${simbolo}$${monto}`;
  };

  const historialLimitado = historial.slice(0, limite);
  const transaccionesOcultas = historial.length - limite;

  // === Renderizado ===
  return (
    <div className="historial-container">
      <div className="historial-header">
        <h2>Recent Activity</h2>
      </div>

      {transaccionesOcultas > 0 && (
        <p className="historial-ocultas">
          Mostrando ultimas {limite} transacciones ({transaccionesOcultas} adicionales)
        </p>
      )}

      {historialLimitado.length === 0 ? (
        <p className="historial-vacio">No hay transacciones registradas</p>
      ) : (
        <ul className="historial-lista">
          {historialLimitado.map((transaccion) => (
            <li key={transaccion.id} className="historial-item">
              <div className="historial-info">
                <span className="historial-descripcion">
                  {transaccion.descripcion || "Movimiento"}
                </span>
                <span className="historial-fecha">{transaccion.fecha}</span>
              </div>

              <div className="historial-monto-acciones">
                <span className={`historial-monto ${transaccion.tipo}`}>
                  {formatearMonto(transaccion.monto, transaccion.tipo)}
                </span>

                <button
                  className="btn-eliminar"
                  onClick={() =>
                    onEliminarTransaccion(
                      transaccion.id,
                      transaccion.tipo,
                      transaccion.monto,
                    )
                  }
                  title="Eliminar transacción"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
