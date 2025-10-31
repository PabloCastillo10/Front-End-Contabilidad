import { getLibroMayor } from "../services/api";
import { useState } from "react";
import Swal from 'sweetalert2';

export const useLibroMayor = () => {
    const [libroMayor, setLibroMayor] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGetLibroMayor = async (cuentaId) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ cuentaId });
            const response = await getLibroMayor(params);
            setLibroMayor(response.data);
            console.log(response, "Libro mayor");
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.message || 'Error',
                icon: 'error',
            })
        } finally {
            setLoading(false);
        }
    }

    return {
        libroMayor,
        loading,
        handleGetLibroMayor,
    }
}