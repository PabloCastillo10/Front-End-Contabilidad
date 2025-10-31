import Layout from "./Layout/Layout"
import { usePartidas } from "../hooks/usePartidas"
import { useCuentas } from "../hooks/useCuentas";
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


const Partidas = () => {
  const {
    partidas,
    loading,
    handleGetPartidas,
    handleCreatePartida,
    handleUpdatePartida,
    handleDeletePartida,
  } = usePartidas();

  const { cuentas, handleGetCuentas } = useCuentas();

  const [formData, setFormData] = useState({
    descripcion: '',
    movimientos: [{ cuenta: '', tipoMovimiento: '', monto: '' }],
  })

 

  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    handleGetPartidas();
    handleGetCuentas();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await handleUpdatePartida(selectedId, formData);
    } else {
      await handleCreatePartida(formData);
    }
    resetForm();
  };

  const handleMovimientoChange = (index, e) => {
    const { name, value } = e.target;
    const newMovimientos = [...formData.movimientos];
    newMovimientos[index][name] = value;
    setFormData({ ...formData, movimientos: newMovimientos });
  };

  // Agregar un nuevo movimiento vacío
  const handleAddMovimiento = () => {
    setFormData({
      ...formData,
      movimientos: [...formData.movimientos, { cuenta: "", tipoMovimiento: "", monto: "" }],
    });
  };

  // Eliminar un movimiento
  const handleRemoveMovimiento = (index) => {
    const newMovimientos = formData.movimientos.filter((_, i) => i !== index);
    setFormData({ ...formData, movimientos: newMovimientos });
  };

  const resetForm = () => {
    setFormData({ descripcion: "", movimientos: [{ cuenta: "", tipoMovimiento: "", monto: "" }] });
    setEditMode(false);
    setSelectedId(null);
  };

  const handleEdit = (partida) => {
    setFormData({
      descripcion: partida.descripcion,
      movimientos: partida.movimientos,
    });
    setSelectedId(partida._id);
    setEditMode(true);
  };


  return (
    <Layout>
      <form onSubmit={handleSubmit} className="p-3 bg-dark text-white rounded">
        <h4>{editMode ? "Editar Partida" : "Nueva Partida"}</h4>

        {/* Descripción */}
        <div className="mb-3">
          <label>Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Movimientos */}
        <div>
          <h5>Movimientos</h5>
          {formData.movimientos.map((mov, index) => (
            <div key={index} className="row align-items-end mb-3 bg-secondary p-2 rounded">
              <div className="col-md-4">
                <label>Cuenta</label>
                <select
                  name="cuenta"
                  value={mov.cuenta}
                  onChange={(e) => handleMovimientoChange(index, e)}
                  className="form-select"
                  required
                >
                  <option value="">Seleccione una cuenta</option>
                  {cuentas?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.codigo} - {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label>Tipo</label>
                <select
                  name="tipoMovimiento"
                  value={mov.tipoMovimiento}
                  onChange={(e) => handleMovimientoChange(index, e)}
                  className="form-select"
                  required
                >
                  <option value="">Seleccione tipo</option>
                  <option value="Debe">Debe</option>
                  <option value="Haber">Haber</option>
                </select>
              </div>

              <div className="col-md-3">
                <label>Monto</label>
                <input
                  type="number"
                  name="monto"
                  value={mov.monto}
                  onChange={(e) => handleMovimientoChange(index, e)}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-2 text-end">
                <button
                  type="button"
                  className="btn btn-danger btn-sm mt-3"
                  onClick={() => handleRemoveMovimiento(index)}
                  disabled={formData.movimientos.length === 1}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={handleAddMovimiento}
          >
            + Agregar movimiento
          </button>
        </div>

        <hr />

        <button type="submit" className="btn btn-primary">
          {editMode ? "Actualizar" : "Crear"}
        </button>
        {editMode && (
          <button type="button" onClick={resetForm} className="btn btn-secondary ms-2">
            Cancelar
          </button>
        )}
      </form>

      <div className="container mt-4">
        <h2>Listado de Partidas</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Movimientos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {partidas?.length > 0 ? (
                partidas.map((p, index) => (
                  <tr key={p._id}>
                    <td>{index + 1}</td>
                    <td>{p.descripcion}</td>
                    <td>{new Date(p.fecha).toLocaleDateString()}</td>
                    <td>
                      {p.movimientos.map((m, i) => (
                        <div key={i}>
                          <strong>{m.cuenta?.nombre}</strong> — {m.tipoMovimiento} — Q{m.monto}
                        </div>
                      ))}
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeletePartida(p._id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay partidas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>


    </Layout>
  )
}

export default Partidas