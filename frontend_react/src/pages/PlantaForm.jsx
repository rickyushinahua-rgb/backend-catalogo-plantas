import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function PlantaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const esEdicion = Boolean(id);

  const [tipos, setTipos] = useState([]);

  const [formulario, setFormulario] = useState({
    nombre: "",
    especie: "",
    descripcion: "",
    cuidados: "",
    precio: "",
    stock: "",
    estado: true,
    tipo_planta: "",
  });

  const [imagen, setImagen] = useState(null);
  const [imagenActual, setImagenActual] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerTipos();

    if (esEdicion) {
      obtenerPlanta();
    }
  }, [id]);

  const obtenerTipos = async () => {
    try {
      const response = await api.get("/tipos-plantas/");
      setTipos(response.data);
    } catch (error) {
      setError("No se pudieron cargar los tipos de plantas.");
    }
  };

  const obtenerPlanta = async () => {
    try {
      const response = await api.get(`/plantas/${id}/`);

      setFormulario({
        nombre: response.data.nombre,
        especie: response.data.especie,
        descripcion: response.data.descripcion,
        cuidados: response.data.cuidados,
        precio: response.data.precio,
        stock: response.data.stock,
        estado: response.data.estado,
        tipo_planta: response.data.tipo_planta,
      });

      setImagenActual(response.data.imagen_url);
    } catch (error) {
      setError("No se pudo cargar la planta.");
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

  const guardarPlanta = async (e) => {
    e.preventDefault();

    if (!formulario.nombre.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    if (!formulario.especie.trim()) {
      alert("La especie es obligatoria.");
      return;
    }

    if (!formulario.descripcion.trim()) {
      alert("La descripción es obligatoria.");
      return;
    }

    if (!formulario.cuidados.trim()) {
      alert("Los cuidados son obligatorios.");
      return;
    }

    if (!formulario.precio || Number(formulario.precio) <= 0) {
      alert("El precio debe ser mayor a 0.");
      return;
    }

    if (formulario.stock === "" || Number(formulario.stock) < 0) {
      alert("El stock no puede ser negativo.");
      return;
    }

    if (!formulario.tipo_planta) {
      alert("Debes seleccionar un tipo de planta.");
      return;
    }

    if (!esEdicion && !imagen) {
      alert("La imagen es obligatoria.");
      return;
    }

    const datos = new FormData();
    datos.append("nombre", formulario.nombre);
    datos.append("especie", formulario.especie);
    datos.append("descripcion", formulario.descripcion);
    datos.append("cuidados", formulario.cuidados);
    datos.append("precio", formulario.precio);
    datos.append("stock", formulario.stock);
    datos.append("estado", formulario.estado);
    datos.append("tipo_planta", formulario.tipo_planta);

    if (imagen) {
      datos.append("imagen", imagen);
    }

    try {
      setCargando(true);

      if (esEdicion) {
        await api.patch(`/plantas/${id}/`, datos, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/plantas/", datos, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/plantas");
    } catch (error) {
      setError("No se pudo guardar la planta. Revisa los datos ingresados.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-green-800">
            {esEdicion ? "Editar planta" : "Registrar planta"}
          </h2>
          <p className="text-slate-600">
            Completa la información de la planta y relaciónala con un tipo de planta.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form onSubmit={guardarPlanta} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
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
                placeholder="Ejemplo: Aloe vera"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Especie
              </label>
              <input
                type="text"
                name="especie"
                value={formulario.especie}
                onChange={manejarCambio}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Ejemplo: Aloe barbadensis miller"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              rows="3"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Descripción de la planta"
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Cuidados
            </label>
            <textarea
              name="cuidados"
              value={formulario.cuidados}
              onChange={manejarCambio}
              rows="3"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Cuidados necesarios"
            ></textarea>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                name="precio"
                value={formulario.precio}
                onChange={manejarCambio}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                placeholder="15.00"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formulario.stock}
                onChange={manejarCambio}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Tipo de planta
              </label>
              <select
                name="tipo_planta"
                value={formulario.tipo_planta}
                onChange={manejarCambio}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 bg-white"
              >
                <option value="">Seleccione...</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
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
              to="/plantas"
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

export default PlantaForm;