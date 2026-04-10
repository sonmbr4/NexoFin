import React from "react";
import { useState  } from "react";

export const Configuracion = () => {
  const [moneda, setMoneda] = useState('USD');
  const [tema, setTema] = useState('light');
  const [notificaciones, setNotificaciones] = useState(true);

  return (
    <div className="configuracion-container">
      <header className="configuracion-header">
        <h1>⚙️ Configuración</h1>
        <p className="configuracion-subtitle">Personaliza tu experiencia</p>
      </header>

      <div className="configuracion-secciones">
        <section className="config-seccion">
          <h2>Preferencias</h2>
          
          <div className="config-item">
            <label>Moneda</label>
            <select value={moneda} onChange={(e) => setMoneda(e.target.value)}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="COP">COP ($)</option>
              <option value="MXN">MXN ($)</option>
            </select>
          </div>

          <div className="config-item">
            <label>Tema</label>
            <select value={tema} onChange={(e) => setTema(e.target.value)}>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="system">Sistema</option>
            </select>
          </div>

          <div className="config-item">
            <label>
              <input 
                type="checkbox" 
                checked={notificaciones}
                onChange={(e) => setNotificaciones(e.target.checked)}
              />
              Activar notificaciones
            </label>
          </div>
        </section>

        <section className="config-seccion">
          <h2>Acerca de</h2>
          
          <div className="config-item">
            <p className="version">Versión 1.0.0</p>
          </div>
          
          <div className="config-item">
            <button className="btn-acerca">Términos y Condiciones</button>
          </div>
          
          <div className="config-item">
            <button className="btn-acerca">Política de Privacidad</button>
          </div>
        </section>
      </div>
    </div>
  );
};