import React, { useMemo, useState } from "react";
import { useCalcularFinanzas } from "../../Logic/CalcularFinanzas";
import { Historial } from "../../components/Historial/historial";
import "./Actividad.css";

export default function Actividad() {
  const { historial, eliminarTransaccion } = useCalcularFinanzas();
  const [filtroActivo, setFiltroActivo] = useState("todos");

  //Calcular estadisticas
  const totalIngresos = historial
    .filter((t) => t.tipo === "ingreso")
    .reduce((acc, t) => acc + t.monto, 0);

  //Calcular total de gastos
  const totalGastos = historial
    .filter((t) => t.tipo === "gasto")
    .reduce((acc, t) => acc + t.monto, 0);

  const historialFiltrado = useMemo(() => {
    if (filtroActivo === "ingresos") {
      return historial.filter((t) => t.tipo === "ingreso");
    }

    if (filtroActivo === "gastos") {
      return historial.filter((t) => t.tipo === "gasto");
    }

    return historial;
  }, [historial, filtroActivo]);

  return (
    <>
      <div className="actividad-container">
        <header className="actividad-header">
          <h1>📊 Actividad</h1>
          <p className="actividad-subtitle">Resumen de tus movimientos</p>
        </header>

        {/* Estadísticas */}
        <div className="estadisticas-container">
          <div className="estadistica-card balance">
            <span className="estadistica-label">Balance</span>
            <span className="estadistica-valor">
              ${(totalIngresos - totalGastos)}
            </span>
          </div>
          <div className="estadistica-card ingresos">
            <span className="estadistica-label">Total Ingresos</span>
            <span className="estadistica-valor">
              + ${totalIngresos}
            </span>
          </div>

          <div className="estadistica-card gastos">
            <span className="estadistica-label">Total Gastos</span>
            <span className="estadistica-valor">
              - ${totalGastos}
            </span>
          </div>
        </div>

        {/* Historial completo */}
        <div className="historial-completo">
          <div className="filtros-actividad" role="tablist" aria-label="Filtros de actividad">
            <button
              className={`filtro-btn ${filtroActivo === "todos" ? "activo" : ""}`}
              type="button"
              onClick={() => setFiltroActivo("todos")}
            >
              TODOS
            </button>
            <button
              className={`filtro-btn ${filtroActivo === "ingresos" ? "activo" : ""}`}
              type="button"
              onClick={() => setFiltroActivo("ingresos")}
            >
              INGRESOS
            </button>
            <button
              className={`filtro-btn ${filtroActivo === "gastos" ? "activo" : ""}`}
              type="button"
              onClick={() => setFiltroActivo("gastos")}
            >
              GASTOS
            </button>
          </div>

          <h2>Historial Completo</h2>
          <Historial
            historial={historialFiltrado}
            onEliminarTransaccion={eliminarTransaccion}
          />
        </div>
      </div>
    </>
  );
}
