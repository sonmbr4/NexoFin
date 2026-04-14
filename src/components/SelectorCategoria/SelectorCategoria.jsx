import { useState, useRef, useEffect } from "react";
import {
  getCategoriasPorTipo,
  getCategoriaPorId,
} from "../../Logic/categorias";

export const SelectorCategoria = ({
  tipo,
  categoriaSeleccionada,
  onChange,
}) => {
  //Estados
  const [abierto, setAbierto] = useState(false);
  const dropdownRef = useRef(null);

  // === Datos ===
  const categorias = getCategoriasPorTipo(tipo);
  const categoriaActual = getCategoriaPorId(categoriaSeleccionada, tipo);

  // === Cerrar al hacer click fuera ===
  useEffect(() => {
    const handleClickFuera = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  // === Manejar Seleccion ===
  const handleSelect = (categoriaId) => {
    onChange({ target: { value: categoriaId } });
    setAbierto(false);
  };

  // === Render ===
  return (
    <>
      <div className="selector-categoria" ref={dropdownRef}>
        <button
          type="button"
          className="selector-categoria-btn"
          onClick={() => setAbierto(!abierto)}
          style={{ borderColor: categoriaActual.color }}
        >
          <span className="categoria-icono">{categoriaActual.icono}</span>
          <span className="categoria-nombre">{categoriaActual.nombre}</span>
          <span className={`selector-flecha ${abierto ? "abierto" : ""}`}>
            ▼
          </span>
        </button>

        {abierto && (
          <div className="selector-categoria-dropdown">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className={`categoria-opcion ${categoriaSeleccionada === categoria.id ? "seleccionada" : ""}`}
                onClick={() => handleSelect(categoria.id)}
                style={{
                  "--categoria-color": categoria.color,
                }}
              >
                <span className="categoria-icono">{categoria.icono}</span>
                <span className="categoria-nombre">{categoria.nombre}</span>
                {categoriaSeleccionada === categoria.id && (
                  <span className="categoria-check">✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
