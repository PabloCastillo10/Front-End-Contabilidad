import Layout from "./Layout/Layout"
import { useEstadoResultado } from "../hooks/useEstadoResultado";
import dayjs from "dayjs";
import { useState } from "react";
import Swal from "sweetalert2";

const EstadoResultados = () => {
  const { estadoResultados, loading, handleGetEstadoResultados } = useEstadoResultado();

  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
  });

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGetEstadoResultados(filtros.fechaInicio, filtros.fechaFin);
  }

  const limpiarFiltros = () => {
    setFiltros({
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

  const handleImprimir = () => {
    window.print();
  }

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Estado de Resultados</h2>

            {/* Formulario de filtros */}
            <div className="card shadow-sm mb-4 no-print">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
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

                    <div className="col-md-4">
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

                    <div className="col-md-4 d-flex align-items-end gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Generando...
                          </>
                        ) : (
                          'Generar Estado'
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={limpiarFiltros}
                      >
                        Limpiar
                      </button>
                      {estadoResultados && (
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleImprimir}
                        >
                          <i className="bi bi-printer"></i> Imprimir
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Resultados del Estado */}
            {estadoResultados && (
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white text-center">
                  <h4 className="mb-1">Estado de Resultados</h4>
                  <p className="mb-0">
                    Período: {estadoResultados.periodo.fechaInicio} - {estadoResultados.periodo.fechaFin}
                  </p>
                </div>

                <div className="card-body">
                  {/* INGRESOS */}
                  <div className="mb-4">
                    <h5 className="text-success fw-bold border-bottom pb-2">
                      INGRESOS
                    </h5>
                    {estadoResultados.ingresos.detalle.length === 0 ? (
                      <p className="text-muted ms-3">No hay ingresos registrados</p>
                    ) : (
                      <table className="table table-sm table-borderless">
                        <tbody>
                          {estadoResultados.ingresos.detalle.map((cuenta, index) => (
                            <tr key={index}>
                              <td className="ps-4">{cuenta.codigo}</td>
                              <td>{cuenta.nombre}</td>
                              <td className="text-end">{formatearMonto(cuenta.saldo)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="border-top border-2">
                          <tr className="fw-bold">
                            <td colSpan="2" className="text-end pe-3">Total Ingresos:</td>
                            <td className="text-end text-success">
                              {formatearMonto(estadoResultados.ingresos.total)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    )}
                  </div>

                  {/* GASTOS */}
                  <div className="mb-4">
                    <h5 className="text-danger fw-bold border-bottom pb-2">
                      GASTOS Y COSTOS
                    </h5>
                    {estadoResultados.gastos.detalle.length === 0 ? (
                      <p className="text-muted ms-3">No hay gastos registrados</p>
                    ) : (
                      <table className="table table-sm table-borderless">
                        <tbody>
                          {estadoResultados.gastos.detalle.map((cuenta, index) => (
                            <tr key={index}>
                              <td className="ps-4">{cuenta.codigo}</td>
                              <td>{cuenta.nombre}</td>
                              <td className="text-end">({formatearMonto(cuenta.saldo)})</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="border-top border-2">
                          <tr className="fw-bold">
                            <td colSpan="2" className="text-end pe-3">Total Gastos:</td>
                            <td className="text-end text-danger">
                              ({formatearMonto(estadoResultados.gastos.total)})
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    )}
                  </div>

                  {/* UTILIDAD/PÉRDIDA NETA */}
                  <div className="mt-4 pt-3 border-top border-dark border-3">
                    <div className="row">
                      <div className="col-md-8 offset-md-4">
                        <div className={`card ${estadoResultados.utilidadNeta >= 0 ? 'bg-success' : 'bg-danger'} text-white`}>
                          <div className="card-body text-center py-4">
                            <h5 className="mb-2">
                              {estadoResultados.tipoResultado === 'Ganancia' ? 'UTILIDAD NETA' : 'PÉRDIDA NETA'}
                            </h5>
                            <h2 className="mb-0">
                              {formatearMonto(Math.abs(estadoResultados.utilidadNeta))}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="mt-4 pt-3 border-top">
                    <div className="row text-center">
                      <div className="col-md-6">
                        <div className="card bg-light">
                          <div className="card-body">
                            <h6 className="text-muted mb-2">Margen de Utilidad</h6>
                            <h4 className={estadoResultados.ingresos.total > 0 ? 'text-primary' : 'text-muted'}>
                              {estadoResultados.ingresos.total > 0 
                                ? ((estadoResultados.utilidadNeta / estadoResultados.ingresos.total) * 100).toFixed(2) + '%'
                                : '0%'
                              }
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card bg-light">
                          <div className="card-body">
                            <h6 className="text-muted mb-2">Fecha de Cierre</h6>
                            <h5>
                              {dayjs(estadoResultados.partidaCierre.fecha).format('DD/MM/YYYY HH:mm')}
                            </h5>
                            <small className="text-muted">
                              Partida #{estadoResultados.partidaCierre._id?.slice(-6) || 'N/A'}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resumen visual */}
                  <div className="mt-4">
                    <div className="alert alert-info">
                      <h6 className="alert-heading">
                        <i className="bi bi-info-circle"></i> Resumen del Período
                      </h6>
                      <hr />
                      <p className="mb-1">
                        <strong>Total de Ingresos:</strong> {formatearMonto(estadoResultados.ingresos.total)}
                      </p>
                      <p className="mb-1">
                        <strong>Total de Gastos:</strong> {formatearMonto(estadoResultados.gastos.total)}
                      </p>
                      <p className="mb-0">
                        <strong>Resultado Final:</strong> {' '}
                        <span className={estadoResultados.utilidadNeta >= 0 ? 'text-success' : 'text-danger'}>
                          {estadoResultados.tipoResultado === 'Ganancia' ? 'Utilidad de ' : 'Pérdida de '}
                          {formatearMonto(Math.abs(estadoResultados.utilidadNeta))}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje si no hay datos */}
            {!estadoResultados && !loading && (
              <div className="alert alert-warning text-center">
                <i className="bi bi-exclamation-triangle fs-1 d-block mb-3"></i>
                <h5>No hay datos para mostrar</h5>
                <p className="mb-0">
                  Selecciona un período y genera el estado de resultados
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estilos para impresión */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .card {
            border: 1px solid #000 !important;
            box-shadow: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </Layout>
  )
}

export default EstadoResultados