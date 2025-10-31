import Layout from "./Layout/Layout"
import { useCuentas } from "../hooks/useCuentas";
import { useLibroMayor } from "../hooks/useLibroMayor";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const LibroMayor = () => {
  const { cuentas, handleGetCuentas } = useCuentas();
  const { libroMayor, loading, handleGetLibroMayor } = useLibroMayor();

  const [filtros, setFiltros] = useState({
    cuentaId: "",
    fechaInicio: "",
    fechaFin: "",
  });

  useEffect(() => {
    handleGetCuentas();
  }, []);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!filtros.cuentaId) {
      return Swal.fire("Seleccione una cuenta", "", "warning");
    }
    handleGetLibroMayor(filtros.cuentaId, filtros.fechaInicio, filtros.fechaFin);
  }

  const limpiarFiltros = () => {
    setFiltros({
      cuentaId: "",
      fechaInicio: "",
      fechaFin: "",
    });
  }

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(monto);
  }

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Libro Mayor</h2>

            {/* Formulario de filtros */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label htmlFor="cuentaId" className="form-label">
                        Cuenta *
                      </label>
                      <select
                        id="cuentaId"
                        name="cuentaId"
                        className="form-select"
                        value={filtros.cuentaId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccione una cuenta</option>
                        {cuentas.map((cuenta) => (
                          <option key={cuenta._id} value={cuenta._id}>
                            {cuenta.codigo} - {cuenta.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="fechaInicio" className="form-label">
                        Fecha Inicio
                      </label>
                      <input
                        type="date"
                        id="fechaInicio"
                        name="fechaInicio"
                        className="form-control"
                        value={filtros.fechaInicio}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="fechaFin" className="form-label">
                        Fecha Fin
                      </label>
                      <input
                        type="date"
                        id="fechaFin"
                        name="fechaFin"
                        className="form-control"
                        value={filtros.fechaFin}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-2 d-flex align-items-end gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Cargando...
                          </>
                        ) : (
                          'Consultar'
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={limpiarFiltros}
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Resultados del Libro Mayor */}
            {libroMayor && (
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    {libroMayor.cuenta.codigo} - {libroMayor.cuenta.nombre}
                  </h5>
                  <small>Tipo: {libroMayor.cuenta.tipo}</small>
                </div>

                <div className="card-body">
                  {libroMayor.movimientos.length === 0 ? (
                    <div className="alert alert-info">
                      No hay movimientos para esta cuenta en el período seleccionado
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead className="table-dark">
                            <tr>
                              <th>Fecha</th>
                              <th>Descripción</th>
                              <th className="text-end">Debe</th>
                              <th className="text-end">Haber</th>
                            </tr>
                          </thead>
                          <tbody>
                            {libroMayor.movimientos.map((mov, index) => (
                              <tr key={index}>
                                <td>{dayjs(mov.fecha).format('DD/MM/YYYY')}</td>
                                <td>{mov.descripcion || 'Sin descripción'}</td>
                                <td className="text-end">
                                  {mov.tipoMovimiento === 'Debe' 
                                    ? formatearMonto(mov.monto) 
                                    : '-'}
                                </td>
                                <td className="text-end">
                                  {mov.tipoMovimiento === 'Haber' 
                                    ? formatearMonto(mov.monto) 
                                    : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="table-secondary fw-bold">
                            <tr>
                              <td colSpan="2" className="text-end">TOTALES:</td>
                              <td className="text-end">
                                {formatearMonto(libroMayor.totales.totalDebe)}
                              </td>
                              <td className="text-end">
                                {formatearMonto(libroMayor.totales.totalHaber)}
                              </td>
                            </tr>
                            <tr className={libroMayor.totales.saldo >= 0 ? 'table-success' : 'table-danger'}>
                              <td colSpan="2" className="text-end">SALDO:</td>
                              <td colSpan="2" className="text-end">
                                {formatearMonto(Math.abs(libroMayor.totales.saldo))}
                                {libroMayor.totales.saldo >= 0 ? ' (Deudor)' : ' (Acreedor)'}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Resumen en cards */}
                      <div className="row mt-4">
                        <div className="col-md-4">
                          <div className="card bg-light">
                            <div className="card-body text-center">
                              <h6 className="text-muted">Total Debe</h6>
                              <h4 className="text-primary">
                                {formatearMonto(libroMayor.totales.totalDebe)}
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card bg-light">
                            <div className="card-body text-center">
                              <h6 className="text-muted">Total Haber</h6>
                              <h4 className="text-danger">
                                {formatearMonto(libroMayor.totales.totalHaber)}
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className={`card ${libroMayor.totales.saldo >= 0 ? 'bg-success' : 'bg-warning'}`}>
                            <div className="card-body text-center text-white">
                              <h6>Saldo Final</h6>
                              <h4>
                                {formatearMonto(Math.abs(libroMayor.totales.saldo))}
                              </h4>
                              <small>
                                {libroMayor.totales.saldo >= 0 ? 'Deudor' : 'Acreedor'}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LibroMayor;