import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const usePartidasNavigation = () => {
    const [partNav, setPartNav] = useState([]);
    const navigate = useNavigate();

    const handlePartidasNavigation = async () => {
        try {
            navigate('/partidas');
        } catch (error) {
            console.log(error);
        }
    }
    return {partNav, handlePartidasNavigation};
}

export const useLibroMayorNavigation = () => {
    const [libroNav, setLibroNav] = useState([]);
    const navigate = useNavigate();

    const handleLibroMayorNavigation = async () => {
        try {
            navigate('/libroMayor');
        } catch (error) {
            console.log(error);
        }
    }
    return {libroNav, handleLibroMayorNavigation};
}

export const useEstadoResultadoNavigation = () => {
    const [estadoNav, setEstadoNav] = useState([]);
    const navigate = useNavigate();

    const handleEstadoResultadoNavigation = async () => {
        try {
            navigate('/estadoResultados');
        } catch (error) {
            console.log(error);
        }
    }
    return {estadoNav, handleEstadoResultadoNavigation};
}

export const useBalanceGeneralNavigation = () => {
    const [balanceNav, setBalanceNav] = useState([]);
    const navigate = useNavigate();

    const handleBalanceGeneralNavigation = async () => {
        try {
            navigate('/balanceGeneral');
        } catch (error) {
            console.log(error);
        }
    }
    return {balanceNav, handleBalanceGeneralNavigation};
}