import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function TipoPlantaList() {
  const [tipos, setTipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerTipos();
  }, []);

  const obtenerTipos = async () => {
    try {
      const response = await api.get("/tipos-plantas/");
      setTipos(response.data);
    } catch (error) {
      setError("No se pudieron cargar los tipos de plantas.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarTipo = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este tipo de planta?"
    );

    if (!confirmar) return;

    try {
      await api.delete(`/tipos-plantas/${id}/`);
      obtenerTipos();
    } catch (error) {
      alert("No se pudo eliminar. Verifica que no tenga plantas relacionadas.");
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-green-700 font-semibold text-xl">
          Cargando tipos de plantas...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-green-800">
              Tipos de plantas
            </h2>
            <p className="text-slate-600">
              Gestión de categorías o tipos de plantas.
            </p>
          </div>

          <Link
            to="/tipos-plantas/nuevo"
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold text-center"
          >
            + Nuevo tipo
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-5">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Imagen</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {tipos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                      No hay tipos de plantas registrados.
                    </td>
                  </tr>
                ) : (
                  tipos.map((tipo) => (
                    <tr key={tipo.id} className="border-b hover:bg-green-50">
                      <td className="px-4 py-3">{tipo.id}</td>

                      <td className="px-4 py-3">
                        {tipo.imagen_url ? (
                          <img
                            src={tipo.imagen_url}
                            alt={tipo.nombre}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center text-xs">
                            Sin imagen
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {tipo.nombre}
                      </td>

                      <td className="px-4 py-3 text-slate-600 max-w-md">
                        {tipo.descripcion}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            tipo.estado
                              ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                              : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"
                          }
                        >
                          {tipo.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/tipos-plantas/editar/${tipo.id}`}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                          >
                            Editar
                          </Link>

                          <button
                            onClick={() => eliminarTipo(tipo.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TipoPlantaList;