import { getBalanceGeneral } from "../services/api";
import { useState } from "react";
import Swal from 'sweetalert2';

export const useBalanceGeneral = () => {
    const [balanceGeneral, setBalanceGeneral] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGetBalanceGeneral = async (fecha) => {
        try {
            setLoading(true);
            const params = {};

            if (fecha) params.fecha = fecha;
            const response = await getBalanceGeneral(params);
            setBalanceGeneral(response.data.data);
            console.log(response, "Balance general");
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.message || 'Error',
                icon: 'error',
            })
            setBalanceGeneral(null);
        } finally {
            setLoading(false);
        }
    }

    return {
        balanceGeneral,
        loading,
        handleGetBalanceGeneral,
    }
}