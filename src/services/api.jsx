import  axios from 'axios'


const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
})


export const createCuenta = async (data) => {
    return await api.post('/api/cuentas/create', data)
}

export const getCuentas = async () => {
    return await api.get('/api/cuentas/')
}

export const updateCuenta = async (id, data) => {
    return await api.put(`/api/cuentas/${id}`, data)
}

export const deleteCuenta = async (id) => {
    return await api.delete(`/api/cuentas/${id}`)
}

export const createPartidas = async (data) => {
    return await api.post('/api/partidas/create', data)
}

export const getPartidas = async () => {
    return await api.get('/api/partidas/partidas')
}

export const updatePartida = async (id, data) => {
    return await api.put(`/api/partidas/partidas/${id}`, data)
}

export const deletePartida = async (id) => {
    return await api.delete(`/api/partidas/partidas/${id}`)
}

export const getLibroMayor = async (params) => {
    return await api.get('/api/libroMayor/', { params })
}

export const getEstadoResultados = async (params) => {
    return await api.get('/api/estadoResultados/', { params })
}

export const getBalanceGeneral = async (params) => {
    return await api.get('/api/balance/general', { params })
}