import { useRoutes } from "react-router-dom"
import Inicio from "../components/Inicio"
import Partidas from "../components/Partidas"
import LibroMayor from "../components/LibroMayor"
import EstadoResultados from "../components/EstadoResultados"
import BalanceGeneral from "../components/BalanceGeneral"

const AppRoutes = () => {
  const routes = useRoutes([
    {path: '/', element: <Inicio />},
    {path: '/partidas', element: <Partidas />},
    {path: '/libroMayor', element: <LibroMayor />},
    {path: '/estadoResultados', element: <EstadoResultados />},
    {path: '/balanceGeneral', element: <BalanceGeneral />},
  ])
  return routes
}

export default AppRoutes