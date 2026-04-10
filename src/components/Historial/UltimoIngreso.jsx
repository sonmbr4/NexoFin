import React from "react";
import "./UltimoIngreso.css";

export const UltimoIngreso = ({ historial }) => {
  // === Ultimo ingreso encontrado ===
  const ultimoIngreso = historial.find(
    (transaccion) => transaccion.tipo === "ingreso",
  );

  // === Renderizado ===
  return (
    <div className="ultimo-ingreso-container">
      <div className="resumen-header ingreso">
        <span className="resumen-icon">↗</span>
        <h3>Ingreso</h3>
      </div>

      {ultimoIngreso ? (
        <div className="ultimo-ingreso-info">
          <p className="ultimo-ingreso-monto">
            ${Number(ultimoIngreso.monto).toLocaleString("es-CO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      ) : (
        <p className="ultimo-ingreso-vacio">No hay ingresos registrados</p>
      )}

      <div className="resumen-barra">
        <span className="resumen-valor ingreso" style={{ width: "72%" }} />
      </div>
    </div>
  );
};
