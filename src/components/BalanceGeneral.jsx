import Layout from "./Layout/Layout"
import { useBalanceGeneral } from "../hooks/useBalanceGeneral";
import dayjs from "dayjs";
import { useState } from "react";
import Swal from "sweetalert2";

const BalanceGeneral = () => {
  const { balanceGeneral, loading, handleGetBalanceGeneral } = useBalanceGeneral();

  const [fecha, setFecha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGetBalanceGeneral(fecha);
  }

  const limpiarFiltros = () => {
    setFecha("");
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

  // Componente recursivo para renderizar cuentas con jerarquía
  const CuentaJerarquica = ({ cuenta, nivel = 0 }) => {
    const tieneHijos = cuenta.hijos && cuenta.hijos.length > 0;
    const esCuentaPadre = nivel === 0;
    const paddingLeft = `${nivel * 2}rem`;

    return (
      <>
        <tr className={esCuentaPadre ? 'fw-bold border-top border-2' : ''}>
          <td style={{ paddingLeft }}>
            {cuenta.codigo}
          </td>
          <td className={esCuentaPadre ? 'text-uppercase' : ''}>
            {cuenta.nombre}
          </td>
          <td className="text-end">
            {!tieneHijos && cuenta.saldo !== 0 ? formatearMonto(cuenta.saldo) : ''}
          </td>
          <td className="text-end fw-bold">
            {esCuentaPadre ? formatearMonto(cuenta.saldo) : ''}
          </td>
        </tr>
        {tieneHijos && cuenta.hijos.map((hijo, index) => (
          <CuentaJerarquica key={index} cuenta={hijo} nivel={nivel + 1} />
        ))}
      </>
    );
  };

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Balance General</h2>

            {/* Formulario de filtros */}
            <div className="card shadow-sm mb-4 no-print">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="fecha" className="form-label">
                        Fecha del Balance (hasta)
                      </label>
                      <input
                        type="date"
                        id="fecha"
                        name="fecha"
                        className="form-control"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                      />
                      <small className="text-muted">
                        Dejar vacío para incluir todas las transacciones
                      </small>
                    </div>

                    <div className="col-md-6 d-flex align-items-end gap-2">
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
                          'Generar Balance'
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={limpiarFiltros}
                      >
                        Limpiar
                      </button>
                      {balanceGeneral && (
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

            {/* Resultados del Balance General */}
            {balanceGeneral && (
              <>
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-primary text-white text-center">
                    <h4 className="mb-1">Balance General</h4>
                    <p className="mb-0">
                      Al {dayjs(balanceGeneral.fecha).format('DD [de] MMMM [de] YYYY')}
                    </p>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      {/* ACTIVOS - Columna Izquierda */}
                      <div className="col-lg-6 mb-4">
                        <div className="border rounded p-3 h-100">
                          <h5 className="text-primary fw-bold mb-3 border-bottom pb-2">
                            ACTIVOS
                          </h5>
                          
                          {balanceGeneral.activos.detalle.length === 0 ? (
                            <p className="text-muted">No hay activos registrados</p>
                          ) : (
                            <table className="table table-sm table-borderless mb-0">
                              <thead>
                                <tr className="text-muted small">
                                  <th style={{ width: '15%' }}>Código</th>
                                  <th style={{ width: '45%' }}>Cuenta</th>
                                  <th className="text-end" style={{ width: '20%' }}>Parcial</th>
                                  <th className="text-end" style={{ width: '20%' }}>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {balanceGeneral.activos.detalle.map((cuenta, index) => (
                                  <CuentaJerarquica key={index} cuenta={cuenta} />
                                ))}
                              </tbody>
                            </table>
                          )}

                          <div className="border-top border-dark border-3 mt-3 pt-2">
                            <div className="row fw-bold fs-5">
                              <div className="col-6 text-end">TOTAL ACTIVOS:</div>
                              <div className="col-6 text-end text-primary">
                                {formatearMonto(balanceGeneral.activos.total)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PASIVOS Y CAPITAL - Columna Derecha */}
                      <div className="col-lg-6">
                        {/* PASIVOS */}
                        <div className="border rounded p-3 mb-3">
                          <h5 className="text-danger fw-bold mb-3 border-bottom pb-2">
                            PASIVOS
                          </h5>

                          {balanceGeneral.pasivos.detalle.length === 0 ? (
                            <p className="text-muted">No hay pasivos registrados</p>
                          ) : (
                            <table className="table table-sm table-borderless mb-0">
                              <thead>
                                <tr className="text-muted small">
                                  <th style={{ width: '15%' }}>Código</th>
                                  <th style={{ width: '45%' }}>Cuenta</th>
                                  <th className="text-end" style={{ width: '20%' }}>Parcial</th>
                                  <th className="text-end" style={{ width: '20%' }}>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {balanceGeneral.pasivos.detalle.map((cuenta, index) => (
                                  <CuentaJerarquica key={index} cuenta={cuenta} />
                                ))}
                              </tbody>
                            </table>
                          )}

                          <div className="border-top border-2 mt-2 pt-2">
                            <div className="row fw-bold">
                              <div className="col-6 text-end">TOTAL PASIVOS:</div>
                              <div className="col-6 text-end text-danger">
                                {formatearMonto(balanceGeneral.pasivos.total)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* CAPITAL */}
                        <div className="border rounded p-3 mb-3">
                          <h5 className="text-success fw-bold mb-3 border-bottom pb-2">
                            CAPITAL
                          </h5>

                          {balanceGeneral.capital.detalle.length === 0 ? (
                            <p className="text-muted">No hay capital registrado</p>
                          ) : (
                            <table className="table table-sm table-borderless mb-0">
                              <thead>
                                <tr className="text-muted small">
                                  <th style={{ width: '15%' }}>Código</th>
                                  <th style={{ width: '45%' }}>Cuenta</th>
                                  <th className="text-end" style={{ width: '20%' }}>Parcial</th>
                                  <th className="text-end" style={{ width: '20%' }}>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {balanceGeneral.capital.detalle.map((cuenta, index) => (
                                  <CuentaJerarquica key={index} cuenta={cuenta} />
                                ))}
                              </tbody>
                            </table>
                          )}

                          <div className="border-top border-2 mt-2 pt-2">
                            <div className="row fw-bold">
                              <div className="col-6 text-end">TOTAL CAPITAL:</div>
                              <div className="col-6 text-end text-success">
                                {formatearMonto(balanceGeneral.capital.total)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* TOTAL PASIVO + CAPITAL */}
                        <div className="border border-dark border-3 rounded p-3 bg-light">
                          <div className="row fw-bold fs-5">
                            <div className="col-6 text-end">TOTAL PASIVO + CAPITAL:</div>
                            <div className="col-6 text-end text-dark">
                              {formatearMonto(balanceGeneral.totales.pasivosMasCapital)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verificación de Ecuación Contable */}
                <div className="row mb-4">
                  <div className="col-md-6 mx-auto">
                    <div className={`alert ${balanceGeneral.totales.ecuacionBalanceada ? 'alert-success' : 'alert-danger'}`}>
                      <h5 className="alert-heading">
                        <i className={`bi ${balanceGeneral.totales.ecuacionBalanceada ? 'bi-check-circle' : 'bi-x-circle'}`}></i>
                        {' '}Ecuación Contable
                      </h5>
                      <hr />
                      <div className="text-center">
                        <p className="mb-2 fs-5">
                          <strong>Activos = Pasivos + Capital</strong>
                        </p>
                        <p className="mb-0">
                          {formatearMonto(balanceGeneral.totales.activos)} = {' '}
                          {formatearMonto(balanceGeneral.totales.pasivos)} + {' '}
                          {formatearMonto(balanceGeneral.totales.capital)}
                        </p>
                        <p className="mb-0 mt-2">
                          {formatearMonto(balanceGeneral.totales.activos)} = {' '}
                          {formatearMonto(balanceGeneral.totales.pasivosMasCapital)}
                        </p>
                        {balanceGeneral.totales.ecuacionBalanceada ? (
                          <p className="text-success fw-bold mt-2 mb-0">✓ Balance cuadrado</p>
                        ) : (
                          <p className="text-danger fw-bold mt-2 mb-0">✗ Balance descuadrado</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen en Cards */}
                <div className="row">
                  <div className="col-md-4">
                    <div className="card bg-primary text-white">
                      <div className="card-body text-center">
                        <h6>ACTIVOS</h6>
                        <h3 className="mb-0">
                          {formatearMonto(balanceGeneral.totales.activos)}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-danger text-white">
                      <div className="card-body text-center">
                        <h6>PASIVOS</h6>
                        <h3 className="mb-0">
                          {formatearMonto(balanceGeneral.totales.pasivos)}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <h6>CAPITAL</h6>
                        <h3 className="mb-0">
                          {formatearMonto(balanceGeneral.totales.capital)}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Mensaje si no hay datos */}
            {!balanceGeneral && !loading && (
              <div className="alert alert-warning text-center">
                <i className="bi bi-exclamation-triangle fs-1 d-block mb-3"></i>
                <h5>No hay datos para mostrar</h5>
                <p className="mb-0">
                  Genera el balance general para ver los resultados
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
            page-break-inside: avoid;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .col-lg-6 {
            width: 50% !important;
            float: left;
          }
        }
      `}</style>
    </Layout>
  )
}

export default BalanceGeneral;