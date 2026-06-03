import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function TipoPlantaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const esEdicion = Boolean(id);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    estado: true,
  });

  const [imagen, setImagen] = useState(null);
  const [imagenActual, setImagenActual] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (esEdicion) {
      obtenerTipo();
    }
  }, [id]);

  const obtenerTipo = async () => {
    try {
      const response = await api.get(`/tipos-plantas/${id}/`);

      setFormulario({
        nombre: response.data.nombre,
        descripcion: response.data.descripcion,
        estado: response.data.estado,
      });

      setImagenActual(response.data.imagen_url);
    } catch (error) {
      setError("No se pudo cargar el tipo de planta.");
    }
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const manejarImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  const guardarTipo = async (e) => {
    e.preventDefault();

    if (!formulario.nombre.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    if (!formulario.descripcion.trim()) {
      alert("La descripción es obligatoria.");
      return;
    }

    if (!esEdicion && !imagen) {
      alert("La imagen es obligatoria.");
      return;
    }

    const datos = new FormData();
    datos.append("nombre", formulario.nombre);
    datos.append("descripcion", formulario.descripcion);
    datos.append("estado", formulario.estado);

    if (imagen) {
      datos.append("imagen", imagen);
    }

    try {
      setCargando(true);

      if (esEdicion) {
        await api.patch(`/tipos-plantas/${id}/`, datos, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/tipos-plantas/", datos, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/tipos-plantas");
    } catch (error) {
      setError("No se pudo guardar el tipo de planta.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-green-800">
            {esEdicion ? "Editar tipo de planta" : "Registrar tipo de planta"}
          </h2>
          <p className="text-slate-600">
            Completa la información del tipo de planta.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form onSubmit={guardarTipo} className="space-y-5">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Ejemplo: Medicinal"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              rows="4"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Descripción del tipo de planta"
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Imagen
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={manejarImagen}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white"
            />

            {imagenActual && (
              <div className="mt-4">
                <p className="text-sm text-slate-500 mb-2">Imagen actual:</p>
                <img
                  src={imagenActual}
                  alt="Imagen actual"
                  className="w-40 h-40 object-cover rounded-xl border"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="estado"
              checked={formulario.estado}
              onChange={manejarCambio}
              className="w-5 h-5"
            />
            <label className="font-semibold text-slate-700">
              Activo
            </label>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              type="submit"
              disabled={cargando}
              className="bg-green-700 hover:bg-green-800 disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {cargando ? "Guardando..." : "Guardar"}
            </button>

            <Link
              to="/tipos-plantas"
              className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TipoPlantaForm;