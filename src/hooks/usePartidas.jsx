import {useState} from 'react';
import Swal from 'sweetalert2';
import { createPartidas, getPartidas, updatePartida, deletePartida } from '../services/api';

export const usePartidas = () => {
    const [partidas, setPartidas] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGetPartidas = async () => {
        try {
            const response = await getPartidas();
            setPartidas(response.data.partidas);
            console.log(response, "Lista de partidas");
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

    const handleCreatePartida = async (data) => {
        try {
            setLoading(true);
            await createPartidas(data);
            await Swal.fire({
                title: 'Partida creada',
                text: 'La partida ha sido creada exitosamente',
                icon: 'success',
                timer: 1500,
                color: 'white',
                background: '#1f2937',
                customClass: {
                    popup: 'animate__animated animate__fadeInDown',
                }
            })
            await handleGetPartidas();
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

    const handleUpdatePartida = async (id, data) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta seguro que desea actualizar esta partida?',
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
                await updatePartida(id, data);
                await Swal.fire({
                    title: 'Partida actualizada',
                    text: 'La partida ha sido actualizada exitosamente',
                    icon: 'success',
                    timer: 1500,
                    color: 'white',
                    background: '#1f2937',
                    customClass: {
                        popup: 'animate__animated animate__fadeInDown',
                    }
                })
                await handleGetPartidas();
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

    const handleDeletePartida = async (id) => {
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
                await deletePartida(id);
                await Swal.fire({
                    title: 'Partida eliminada',
                    text: 'La partida ha sido eliminada exitosamente',
                    icon: 'success',
                    timer: 1500,
                    color: 'white',
                    background: '#1f2937',
                    customClass: {
                        popup: 'animate__animated animate__fadeInDown',
                    }
                })
                await handleGetPartidas();
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
        partidas,
        loading,
        handleGetPartidas,
        handleCreatePartida,
        handleUpdatePartida,
        handleDeletePartida,
    }
}