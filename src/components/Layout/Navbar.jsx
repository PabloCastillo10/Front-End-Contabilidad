import { usePartidasNavigation, useLibroMayorNavigation, useEstadoResultadoNavigation, useBalanceGeneralNavigation } from "../../hooks/useInicio"
import { useLocation } from "react-router-dom";
const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { handlePartidasNavigation } = usePartidasNavigation();
    const { handleLibroMayorNavigation } = useLibroMayorNavigation();
    const { handleEstadoResultadoNavigation } = useEstadoResultadoNavigation();
    const { handleBalanceGeneralNavigation } = useBalanceGeneralNavigation();
    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Inicio</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <button
                                className={`nav-link ${currentPath === "/partidas" ? "fw-bold text-dark" : "text-secondary"}`}
                                onClick={handlePartidasNavigation}
                            >
                                Partidas
                            </button>
                        </li>
                        <li class="nav-item">
                            <button 
                                className={`nav-link ${currentPath === "/libroMayor" ? "fw-bold text-dark" : "text-secondary"}`}
                                onClick={handleLibroMayorNavigation}
                            >
                                Libro Mayor
                            </button>
                        </li>
                        <li class="nav-item">
                            <button
                                className={`nav-link ${currentPath === "/estadoResultados" ? "fw-bold text-dark" : "text-secondary"}`}
                                onClick={handleEstadoResultadoNavigation}
                            >
                                Estado Resultados
                            </button>
                        </li>
                        <li class="nav-item">
                            <button
                                className={`nav-link ${currentPath === "/balanceGeneral" ? "fw-bold text-dark" : "text-secondary"}`}
                                onClick={handleBalanceGeneralNavigation}
                            >
                                Balance General
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar