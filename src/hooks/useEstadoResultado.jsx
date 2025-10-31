import { getEstadoResultados } from "../services/api";
import { useState } from "react";
import Swal from 'sweetalert2';

export const useEstadoResultado = () => {
    const [estadoResultados, setEstadoResultados] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGetEstadoResultados = async (fechaInicio, fechaFin) => {
        try {
            setLoading(true);
            const params = {};

            if (fechaInicio) params.fechaInicio = fechaInicio;
            if (fechaFin) params.fechaFin = fechaFin;
            const response = await getEstadoResultados(params);
            setEstadoResultados(response.data.data);
            console.log(response, "Lista de estado de resultados");
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.message || 'Error',
                icon: 'error',
            })
            setEstadoResultados(null);
        } finally {
            setLoading(false);
        }
    }

    return {
        estadoResultados,
        loading,
        handleGetEstadoResultados,
    }
}