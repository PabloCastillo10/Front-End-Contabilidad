import Layout from "./Layout/Layout"
import { useCuentas } from "../hooks/useCuentas"
import { useState, useEffect } from 'react';


const Inicio = () => {
    const {
        cuentas,
        loading,
        handleGetCuentas,
        handleCreateCuenta,
        handleUpdateCuenta,
        handleDeleteCuenta,
    } = useCuentas();

    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        tipo: 'Activo'
    })

    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        handleGetCuentas();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await handleUpdateCuenta(selectedId, formData);
        } else {
            await handleCreateCuenta(formData);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({ codigo: "", nombre: "", tipo: "Activo" });
        setEditMode(false);
        setSelectedId(null);
    };

    const handleEdit = (cuenta) => {
        setFormData({
            codigo: cuenta.codigo,
            nombre: cuenta.nombre,
            tipo: cuenta.tipo,
        });
        setSelectedId(cuenta._id);
        setEditMode(true);
    };

    

    return (
        <Layout>
            <div className="container mt-4">
                <h2 className="mb-4">{editMode ? "Editar Cuenta" : "Crear Cuenta"}</h2>

                <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded bg-light">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Código</label>
                            <input
                                type="text"
                                name="codigo"
                                className="form-control"
                                value={formData.codigo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                className="form-control"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Tipo</label>
                            <select
                                name="tipo"
                                className="form-select"
                                value={formData.tipo}
                                onChange={handleChange}
                            >
                                <option value="Activo">Activo</option>
                                <option value="Pasivo">Pasivo</option>
                                <option value="Capital">Capital</option>
                                <option value="Ganancia">Ganancia</option>
                                <option value="Perdida">Pérdida</option>
                                <option value="Resultado">Resultado</option>
                            </select>
                        </div>

                        <div className="col-md-2 d-flex align-items-end">
                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {editMode ? "Actualizar" : "Guardar"}
                            </button>
                        </div>
                    </div>
                </form>

                <h3>Lista de Cuentas</h3>
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Saldo Deudor</th>
                            <th>Saldo Acreedor</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuentas.length > 0 ? (
                            cuentas.map((cuenta) => (
                                <tr key={cuenta._id}>
                                    <td>{cuenta.codigo}</td>
                                    <td>{cuenta.nombre}</td>
                                    <td>{cuenta.tipo}</td>
                                    <td>{cuenta.saldoDeudor}</td>
                                    <td>{cuenta.saldoAcreedor}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(cuenta)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteCuenta(cuenta._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No hay cuentas registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}

export default Inicio