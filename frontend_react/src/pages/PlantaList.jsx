import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function PlantaList() {
  const [plantas, setPlantas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerPlantas();
  }, []);

  const obtenerPlantas = async () => {
    try {
      const response = await api.get("/plantas/");
      setPlantas(response.data);
    } catch (error) {
      setError("No se pudieron cargar las plantas.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarPlanta = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta planta?"
    );

    if (!confirmar) return;

    try {
      await api.delete(`/plantas/${id}/`);
      obtenerPlantas();
    } catch (error) {
      alert("No se pudo eliminar la planta.");
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-green-700 font-semibold text-xl">
          Cargando plantas...
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
              Plantas
            </h2>
            <p className="text-slate-600">
              Gestión de plantas registradas en el catálogo.
            </p>
          </div>

          <Link
            to="/plantas/nuevo"
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold text-center"
          >
            + Nueva planta
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
                  <th className="px-4 py-3">Especie</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {plantas.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-6 text-center text-slate-500">
                      No hay plantas registradas.
                    </td>
                  </tr>
                ) : (
                  plantas.map((planta) => (
                    <tr key={planta.id} className="border-b hover:bg-green-50">
                      <td className="px-4 py-3">{planta.id}</td>

                      <td className="px-4 py-3">
                        {planta.imagen_url ? (
                          <img
                            src={planta.imagen_url}
                            alt={planta.nombre}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center text-xs">
                            Sin imagen
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {planta.nombre}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {planta.especie}
                      </td>

                      <td className="px-4 py-3 text-green-700 font-semibold">
                        {planta.tipo_planta_nombre}
                      </td>

                      <td className="px-4 py-3 font-semibold">
                        S/ {Number(planta.precio).toFixed(2)}
                      </td>

                      <td className="px-4 py-3">
                        {planta.stock}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            planta.estado
                              ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                              : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"
                          }
                        >
                          {planta.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/plantas/editar/${planta.id}`}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                          >
                            Editar
                          </Link>

                          <button
                            onClick={() => eliminarPlanta(planta.id)}
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

export default PlantaList;