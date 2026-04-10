// components/UltimoGasto/UltimoGasto.jsx
import React from "react";
import "./UltimoGasto.css";

export const UltimoGasto = ({ historial }) => {
  // ========== ENCONTRAR ÚLTIMO GASTO ==========
  const ultimoGasto = historial.find(
    (transaccion) => transaccion.tipo === "gasto",
  );

  // ========== RENDER ==========
  return (
    <div className="ultimo-gasto-container">
      <div className="resumen-header gasto">
        <span className="resumen-icon">↘</span>
        <h3>Gasto</h3>
      </div>

      {ultimoGasto ? (
        <div className="ultimo-gasto-info">
          <p className="ultimo-gasto-monto">
            ${Number(ultimoGasto.monto).toLocaleString("es-CO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      ) : (
        <p className="ultimo-gasto-vacio">No hay gastos registrados</p>
      )}

      <div className="resumen-barra">
        <span className="resumen-valor gasto" style={{ width: "50%" }} />
      </div>
    </div>
  );
};
