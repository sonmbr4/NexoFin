import { useEffect, useState } from "react";
import { getCategoriaPorId } from "./categorias";

export const useCalcularFinanzas = () => {
    //========= Constantes =========
    const STORAGE_KEY = {
        TOTAL: 'nexofin_total',
        HISTORIAL: 'nexofin_historial'
    };

    const cargarDesdeStorage = () => {
        try {
            const totalGuardado = localStorage.getItem(STORAGE_KEY.TOTAL);
            const historialGuardado = localStorage.getItem(STORAGE_KEY.HISTORIAL);

            const totalInicial = totalGuardado ? parseFloat(totalGuardado) : 0;
            const historialInicial = historialGuardado ? JSON.parse(historialGuardado) : [];

            return { totalInicial, historialInicial };
        } catch (error) {
            console.error("Error al cargar desde localStorage:", error);
            return { totalInicial: 0, historialInicial: [] };
        }
    }

    const { totalInicial, historialInicial } = cargarDesdeStorage();

    const [total, setTotal] = useState(totalInicial);
    const [montoAgregar, setMontoAgregar] = useState('');
    const [montoQuitar, setMontoQuitar] = useState('');
    const [historial, setHistorial] = useState(historialInicial);
    const [categoriaIngreso, setCategoriaIngreso] = useState('otro_ingreso');
    const [categoriaGasto, setCategoriaGasto] = useState('otro_gasto');



    // === Guardar en localStorage ===
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY.TOTAL, total.toString());
    }, [total]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY.HISTORIAL, JSON.stringify(historial));
    }, [historial]);


    // === FUNCIONES ===

    // Auxiliares
    const generarId = () => {
        return Date.now() + Math.random();
    }

    const formatearFecha = () => {
        const fecha = new Date();
        return fecha.toLocaleString('es-Es', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }




    // Función para agregar dinero
    const handleAgregar = () => {
        const monto = parseFloat(montoAgregar);
        if (!isNaN(monto) && monto > 0) {
            setTotal(prevTotal => prevTotal + monto);
            const categoriaInfo = getCategoriaPorId(categoriaIngreso, 'ingreso')

            //Crear Transaccion
            const nuevaTransaccion = {
                id: generarId(),
                tipo: 'ingreso',
                monto: monto,
                fecha: formatearFecha(),
                categoria: categoriaIngreso,
                categoriaIcono: categoriaInfo.icono,
                categoriaColor: categoriaInfo.color,
                descripcion: categoriaInfo.nombre
            }

            setHistorial(prevHistorial => [nuevaTransaccion, ...prevHistorial]);
            //setTotal(total + monto);
            setMontoAgregar(''); // Limpiar el campo
        }
    };

    // Función para quitar dinero
    const handleQuitar = () => {
        const monto = parseFloat(montoQuitar);
        if (!isNaN(monto) && monto > 0) {
            setTotal(prevTotal => prevTotal - monto);
            const categoriaInfo = getCategoriaPorId(categoriaGasto, 'gasto');

            //Crear Transaccion
            const nuevaTransaccion = {
                id: generarId(),
                tipo: 'gasto',
                monto: monto,
                fecha: formatearFecha(),
                categoria: categoriaGasto,
                categoriaIcono: categoriaInfo.icono,
                categoriaColor: categoriaInfo.color,
                descripcion: categoriaInfo.nombre
            }

            //Actualizar Historial
            setHistorial(prevHistorial => [nuevaTransaccion, ...prevHistorial]);
            //setTotal(total - monto);
            setMontoQuitar(''); // Limpiar el campo
        }
    };

    //fUNCION PARA ELIMINAR UNA TRANSACCIÓN
    const eliminarTransaccion = (id, tipo, monto) => {
        //Actualizar Total
        if (tipo === 'ingreso') {
            setTotal(prevTotal => prevTotal - monto);
        } else {
            setTotal(prevTotal => prevTotal + monto);
        }

        // Eliminar del historial
        setHistorial(prevHistorial => prevHistorial.filter(transaccion => transaccion.id !== id));

    }


    const handleMontoAgregarChange = (e) => setMontoAgregar(e.target.value);
    const handleMontoQuitarChange = (e) => setMontoQuitar(e.target.value);

    const handleCategoriaIngresoChange = (e) => setCategoriaIngreso(e.target.value);
    const handleCategoriaGastoChange = (e) => setCategoriaGasto(e.target.value);
    return {
        //Estados
        total,
        montoAgregar,
        montoQuitar,
        historial,
        categoriaIngreso,
        categoriaGasto,

        // Handlers
        handleAgregar,
        handleQuitar,
        handleMontoAgregarChange,
        handleMontoQuitarChange,
        handleCategoriaIngresoChange,
        handleCategoriaGastoChange,
        eliminarTransaccion,
    }
}