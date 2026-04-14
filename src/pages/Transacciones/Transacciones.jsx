import { useState } from "react";
import { useCalcularFinanzas } from "../../Logic/CalcularFinanzas";
import { IngresoRecurrente } from "../../components/IngresoRecurrente/IngresoRecurrente";
import { SelectorCategoria } from "../../components/SelectorCategoria/SelectorCategoria";
import './Transacciones.css';

export default function Transacciones() {
  //=== Hooks ===
  const {
    total,
    montoAgregar,
    montoQuitar,
    categoriaIngreso,
    categoriaGasto,
    handleAgregar,
    handleQuitar,
    handleMontoAgregarChange,
    handleMontoQuitarChange,
    handleCategoriaIngresoChange,
    handleCategoriaGastoChange,
  } = useCalcularFinanzas();

  // === Estado Local
  const [tabActiva, setTabActiva] = useState("ingreso");

  const montoActual = tabActiva === "ingreso" ? montoAgregar : montoQuitar;
  const montoNumerico = Number.parseFloat(montoActual) || 0;

  const actualizarMontoActual = (value) => {
    const evento = { target: { value } };
    if (tabActiva === "ingreso") {
      handleMontoAgregarChange(evento);
      return;
    }
    handleMontoQuitarChange(evento);
  };

  const manejarTeclado = (tecla) => {
    let siguienteValor = String(montoActual ?? "");

    if (tecla === "borrar") {
      actualizarMontoActual(siguienteValor.slice(0, -1));
      return;
    }

    if (tecla === ".") {
      if (siguienteValor.includes(".")) return;
      actualizarMontoActual(siguienteValor ? `${siguienteValor}.` : "0.");
      return;
    }

    if (siguienteValor === "0") {
      siguienteValor = tecla;
    } else {
      siguienteValor += tecla;
    }

    actualizarMontoActual(siguienteValor);
  };

  const formatearMoneda = (valor) =>
    valor.toLocaleString("es-CO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <>
      <div className="transacciones-container">
        <header className="transacciones-header">
          <div className="header-navigation">
            <h1>NEW ENTRY</h1>
          </div>
        </header>

        <section className="panel-monto">
          <p className="monto-label">ENTER AMOUNT</p>
          <div className="header-con-boton">
            <IngresoRecurrente />
          </div>
          <p className="monto-valor">$ {formatearMoneda(montoNumerico)}</p>
        </section>

        {/* Tabs para alternar entre ingreso y gasto */}
        <div className="tabs-shell">
          <div className="tabs-container">
            <button
              className={`tab-btn ${tabActiva === "ingreso" ? "active" : ""}`}
              onClick={() => setTabActiva("ingreso")}
            >
              INGRESO
            </button>
            <button
              className={`tab-btn ${tabActiva === "gasto" ? "active" : ""}`}
              onClick={() => setTabActiva("gasto")}
            >
              GASTO
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Categoria</label>
          <SelectorCategoria
            tipo={tabActiva}
            categoriaSeleccionada={tabActiva === "ingreso" ? categoriaIngreso : categoriaGasto}
            onChange={tabActiva === "ingreso" ? handleCategoriaIngresoChange : handleCategoriaGastoChange}
          />

        </div>

        {/* Advertencia si el gasto es mayor al balance */}
        {tabActiva === "gasto" && montoNumerico > total && (
          <div className="advertencia">
            Este gasto es mayor a tu balance actual
          </div>
        )}

        <section className="teclado-grid" aria-label="Teclado numérico">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "borrar"].map((tecla) => (
            <button
              key={tecla}
              type="button"
              className={`tecla ${tecla === "borrar" ? "tecla-borrar" : ""}`}
              onClick={() => manejarTeclado(tecla)}
            >
              {tecla === "borrar" ? "⌫" : tecla}
            </button>
          ))}
        </section>

        <div className="confirmar-wrap">
          <button
            className="btn-confirmar"
            onClick={tabActiva === "ingreso" ? handleAgregar : handleQuitar}
            disabled={montoNumerico <= 0}
          >
            CONFIRM ENTRY →
          </button>
        </div>
      </div>
    </>
  );
}
