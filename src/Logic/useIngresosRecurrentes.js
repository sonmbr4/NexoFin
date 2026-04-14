// Logic/useIngresosRecurrentes.js
import { useState, useEffect } from 'react';

export const useIngresosRecurrentes = () => {
  // ========== ESTADOS ==========
  const [ingresoRecurrente, setIngresoRecurrente] = useState(null);
  const [ultimaEjecucion, setUltimaEjecucion] = useState(null);

  // ========== CARGAR DATOS GUARDADOS ==========
  useEffect(() => {
    const guardado = localStorage.getItem('nexofin_ingreso_recurrente');
    const ultimaEjecucionGuardada = localStorage.getItem('nexofin_ultima_ejecucion');
    
    if (guardado) {
      setIngresoRecurrente(JSON.parse(guardado));
    }
    if (ultimaEjecucionGuardada) {
      setUltimaEjecucion(ultimaEjecucionGuardada);
    }
  }, []);

  // ========== VERIFICAR Y EJECUTAR INGRESO RECURRENTE ==========
  useEffect(() => {
    if (!ingresoRecurrente || !ingresoRecurrente.activo) return;

    const verificarIngreso = () => {
      const hoy = new Date();
      const proximaFecha = new Date(ingresoRecurrente.proximoPago);
      
      // Si ya pasó la fecha del próximo pago
      if (hoy >= proximaFecha) {
        // Verificar que no se haya ejecutado ya hoy
        const ultimaEjecucionFecha = ultimaEjecucion ? new Date(ultimaEjecucion) : null;
        const hoyStr = hoy.toDateString();
        
        if (!ultimaEjecucionFecha || ultimaEjecucionFecha.toDateString() !== hoyStr) {
          // Ejecutar el ingreso
          ejecutarIngresoRecurrente();
        }
      }
    };

    // Verificar al cargar
    verificarIngreso();

    // Verificar cada hora
    const intervalo = setInterval(verificarIngreso, 3600000); // 1 hora

    return () => clearInterval(intervalo);
  }, [ingresoRecurrente, ultimaEjecucion]);

  // ========== FUNCIONES ==========
  const ejecutarIngresoRecurrente = () => {
    // Obtener historial actual
    const historialGuardado = localStorage.getItem('nexofin_historial');
    const historial = historialGuardado ? JSON.parse(historialGuardado) : [];
    
    // Obtener total actual
    const totalGuardado = localStorage.getItem('nexofin_total');
    const totalActual = totalGuardado ? parseFloat(totalGuardado) : 0;
    
    // Crear nueva transacción
    const nuevaTransaccion = {
      id: Date.now() + Math.random(),
      tipo: 'ingreso',
      monto: ingresoRecurrente.monto,
      fecha: new Date().toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      descripcion: `⚙️ ${ingresoRecurrente.tipo === 'mensual' ? 'Salario Mensual' : 'Salario Quincenal'}`
    };
    
    // Actualizar historial
    const nuevoHistorial = [nuevaTransaccion, ...historial];
    localStorage.setItem('nexofin_historial', JSON.stringify(nuevoHistorial));
    
    // Actualizar total
    const nuevoTotal = totalActual + ingresoRecurrente.monto;
    localStorage.setItem('nexofin_total', nuevoTotal.toString());
    
    // Calcular próximo pago
    const proximoPago = calcularProximoPago(
      ingresoRecurrente.proximoPago,
      ingresoRecurrente.tipo
    );
    
    // Actualizar ingreso recurrente con nueva fecha
    const ingresoActualizado = {
      ...ingresoRecurrente,
      proximoPago: proximoPago.toISOString()
    };
    
    setIngresoRecurrente(ingresoActualizado);
    localStorage.setItem('nexofin_ingreso_recurrente', JSON.stringify(ingresoActualizado));
    
    // Guardar última ejecución
    const ahora = new Date().toISOString();
    setUltimaEjecucion(ahora);
    localStorage.setItem('nexofin_ultima_ejecucion', ahora);
    
    // Recargar la página para reflejar cambios
    window.location.reload();
  };

  const calcularProximoPago = (fechaBase, tipo) => {
    const fecha = new Date(fechaBase);
    
    if (tipo === 'mensual') {
      fecha.setMonth(fecha.getMonth() + 1);
    } else if (tipo === 'quincenal') {
      fecha.setDate(fecha.getDate() + 15);
    }
    
    return fecha;
  };

  const guardarIngresoRecurrente = (config) => {
    const ingresoConfig = {
      ...config,
      activo: true,
      fechaCreacion: new Date().toISOString()
    };
    
    setIngresoRecurrente(ingresoConfig);
    localStorage.setItem('nexofin_ingreso_recurrente', JSON.stringify(ingresoConfig));
  };

  const desactivarIngresoRecurrente = () => {
    if (ingresoRecurrente) {
      const ingresoActualizado = {
        ...ingresoRecurrente,
        activo: false
      };
      setIngresoRecurrente(ingresoActualizado);
      localStorage.setItem('nexofin_ingreso_recurrente', JSON.stringify(ingresoActualizado));
    }
  };

  const activarIngresoRecurrente = () => {
    if (ingresoRecurrente) {
      const ingresoActualizado = {
        ...ingresoRecurrente,
        activo: true
      };
      setIngresoRecurrente(ingresoActualizado);
      localStorage.setItem('nexofin_ingreso_recurrente', JSON.stringify(ingresoActualizado));
    }
  };

  const eliminarIngresoRecurrente = () => {
    setIngresoRecurrente(null);
    setUltimaEjecucion(null);
    localStorage.removeItem('nexofin_ingreso_recurrente');
    localStorage.removeItem('nexofin_ultima_ejecucion');
  };

  return {
    ingresoRecurrente,
    guardarIngresoRecurrente,
    desactivarIngresoRecurrente,
    activarIngresoRecurrente,
    eliminarIngresoRecurrente,
    calcularProximoPago
  };
};