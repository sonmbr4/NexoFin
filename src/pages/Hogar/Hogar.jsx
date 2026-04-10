import { useCalcularFinanzas } from "../../Logic/CalcularFinanzas";
import { Historial } from "../../components/Historial/historial";
import { UltimoIngreso } from "../../components/Historial/UltimoIngreso";
import { UltimoGasto } from "../../components/Historial/UltimoGasto";

import "./Hogar.css";

export default function Home() {
  // ========== HOOKS ==========
  const {
    total,
    historial,
    eliminarTransaccion,
  } = useCalcularFinanzas();

  const totalFormateado = total.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // ========== RENDER ==========
  return (
    <>
      <div className="App">

        <div className="bloque-total">
          <p className="total-label">Total</p>
          <p className="total">${totalFormateado}</p>
        </div>

        <div className="resumenes-container">
          <UltimoIngreso historial={historial} />
          <UltimoGasto historial={historial} />
        </div>

        <div className="historial-wrap">
          <Historial
            historial={historial}
            onEliminarTransaccion={eliminarTransaccion}
            limite={4}
          />
        </div>
      </div>
    </>
  );
}
