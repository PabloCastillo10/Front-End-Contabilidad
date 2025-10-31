import { useState } from 'react';
import Swal from 'sweetalert2';
import { createCuenta, getCuentas, updateCuenta, deleteCuenta } from '../services/api';

export const useCuentas = () => {
    const [cuentas, setCuentas] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGetCuentas = async () => {
        try {
            const response = await getCuentas();
            setCuentas(response.data.cuentas);
            console.log(response, "Lista de cuentas");
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

    const handleCreateCuenta = async (data) => {
        try {
            setLoading(true);
            await createCuenta(data);
            await Swal.fire({
                title: 'Cuenta creada',
                text: 'La cuenta ha sido creada exitosamente',
                icon: 'success',
                timer: 1500,
                color: 'white',
                background: '#1f2937',
                customClass: {
                    popup: 'animate__animated animate__fadeInDown',
                }
            })
            await handleGetCuentas();
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

    const handleUpdateCuenta = async (id, data) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta seguro que desea actualizar esta cuenta?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            color: 'white',
            background: '#1f2937',
            customClass: {
                popup: 'animate__animated animate__fadeInDown',
            }
        })
        if (confirm.isConfirmed) {
            try {
                setLoading(true);
                await updateCuenta(id, data);
                await Swal.fire({
                    title: 'Cuenta actualizada',
                    text: 'La cuenta ha sido actualizada exitosamente',
                    icon: 'success',
                    timer: 1500,
                    color: 'white',
                    background: '#1f2937',
                    customClass: {
                        popup: 'animate__animated animate__fadeInDown',
                    }
                })
                await handleGetCuentas();
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
    }

    const handleDeleteCuenta = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar',
            color: 'white',
            background: '#1f2937',
            customClass: {
                popup: 'animate__animated animate__fadeInDown',
            }
        })
        if (confirm.isConfirmed) {
            try {
                setLoading(true);
                await deleteCuenta(id);
                await Swal.fire({
                    title: 'Cuenta eliminada',
                    text: 'La cuenta ha sido eliminada exitosamente',
                    icon: 'success',
                    timer: 1500,
                    color: 'white',
                    background: '#1f2937',
                    customClass: {
                        popup: 'animate__animated animate__fadeInDown',
                    }
                })
                await handleGetCuentas();
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
    }

    return {
        cuentas,
        loading,
        handleGetCuentas,
        handleCreateCuenta,
        handleUpdateCuenta,
        handleDeleteCuenta,
    }
}