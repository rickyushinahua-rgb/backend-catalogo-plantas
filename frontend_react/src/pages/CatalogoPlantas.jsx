import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

function CatalogoPlantas() {
    const [plantas, setPlantas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [mostrarPago, setMostrarPago] = useState(false);
    const [pagoRealizado, setPagoRealizado] = useState(false);

    const [formPago, setFormPago] = useState({
        nombre: "",
        tarjeta: "",
        cvv: "",
    });

    useEffect(() => {
        obtenerPlantas();
    }, []);

    const obtenerPlantas = async () => {
        try {
            const response = await api.get("/plantas/");
            setPlantas(response.data);
        } catch (error) {
            setError("No se pudieron cargar las plantas desde el backend.");
        } finally {
            setCargando(false);
        }
    };

    const plantasFiltradas = useMemo(() => {
        return plantas.filter((planta) =>
            planta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            planta.especie.toLowerCase().includes(busqueda.toLowerCase()) ||
            planta.tipo_planta_nombre.toLowerCase().includes(busqueda.toLowerCase())
        );
    }, [plantas, busqueda]);

    const agregarAlCarrito = (planta) => {
        const existe = carrito.find((item) => item.id === planta.id);

        if (existe) {
            const nuevoCarrito = carrito.map((item) =>
                item.id === planta.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            );
            setCarrito(nuevoCarrito);
        } else {
            setCarrito([...carrito, { ...planta, cantidad: 1 }]);
        }
    };

    const eliminarDelCarrito = (id) => {
        const nuevoCarrito = carrito.filter((item) => item.id !== id);
        setCarrito(nuevoCarrito);
    };

    const aumentarCantidad = (id) => {
        const nuevoCarrito = carrito.map((item) =>
            item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
        setCarrito(nuevoCarrito);
    };

    const disminuirCantidad = (id) => {
        const nuevoCarrito = carrito
            .map((item) =>
                item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
            )
            .filter((item) => item.cantidad > 0);

        setCarrito(nuevoCarrito);
    };

    const totalCarrito = carrito.reduce((total, item) => {
        return total + Number(item.precio) * item.cantidad;
    }, 0);

    const cantidadTotal = carrito.reduce((total, item) => {
        return total + item.cantidad;
    }, 0);

    const abrirPago = () => {
        if (carrito.length === 0) {
            alert("Primero agrega una planta al carrito.");
            return;
        }

        setMostrarCarrito(false);
        setMostrarPago(true);
    };

    const confirmarPago = (e) => {
        e.preventDefault();

        if (!formPago.nombre || !formPago.tarjeta || !formPago.cvv) {
            alert("Completa todos los campos del pago simulado.");
            return;
        }

        setMostrarPago(false);
        setPagoRealizado(true);
        setCarrito([]);
        setFormPago({
            nombre: "",
            tarjeta: "",
            cvv: "",
        });
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <p className="text-xl font-semibold text-green-700">
                    Cargando catálogo de plantas...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50">
            <header className="bg-white shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-green-800">
                            Catálogo de Plantas
                        </h1>
                        <p className="text-slate-600">
                            Explora plantas registradas desde Django REST Framework.
                        </p>
                    </div>

                    <button
                        onClick={() => setMostrarCarrito(true)}
                        className="relative w-fit bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-full font-semibold shadow-md transition"
                    >
                        🛒 Carrito
                        {cantidadTotal > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                                {cantidadTotal}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <section className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Tienda verde
                    </h2>
                    
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, especie o tipo de planta..."
                        className="w-full md:w-1/2 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                    />
                </section>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {plantasFiltradas.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                        <p className="text-slate-600">
                            No se encontraron plantas registradas.
                        </p>
                    </div>
                ) : (
                    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {plantasFiltradas.map((planta) => (
                            <article
                                key={planta.id}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col"
                            >
                                {planta.imagen_url ? (
                                    <img
                                        src={planta.imagen_url}
                                        alt={planta.nombre}
                                        className="w-full h-52 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-52 bg-green-100 flex items-center justify-center text-green-700">
                                        Sin imagen
                                    </div>
                                )}

                                <div className="p-5 flex flex-col flex-1">
                                    <span className="text-sm text-green-700 font-bold uppercase">
                                        {planta.tipo_planta_nombre}
                                    </span>

                                    <h3 className="text-xl font-bold text-slate-800 mt-1">
                                        {planta.nombre}
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Especie: {planta.especie}
                                    </p>

                                    <p className="text-slate-600 mt-3 line-clamp-3">
                                        {planta.descripcion}
                                    </p>

                                    <p className="text-sm text-slate-500 mt-3 line-clamp-2">
                                        Cuidados: {planta.cuidados}
                                    </p>

                                    <div className="mt-auto pt-5 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xl font-bold text-green-700">
                                                S/ {Number(planta.precio).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Stock: {planta.stock}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => agregarAlCarrito(planta)}
                                            disabled={!planta.estado || planta.stock <= 0}
                                            className="bg-green-700 hover:bg-green-800 disabled:bg-slate-400 text-white px-4 py-2 rounded-xl font-semibold transition"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>

            {mostrarCarrito && (
                <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-2xl font-bold text-slate-800">
                                Carrito de compras
                            </h2>

                            <button
                                onClick={() => setMostrarCarrito(false)}
                                className="bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {carrito.length === 0 ? (
                            <p className="text-slate-600">El carrito está vacío.</p>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {carrito.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 border-b border-slate-200 pb-4"
                                    >
                                        {item.imagen_url ? (
                                            <img
                                                src={item.imagen_url}
                                                alt={item.nombre}
                                                className="w-20 h-20 object-cover rounded-xl"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 bg-green-100 rounded-xl flex items-center justify-center text-xs">
                                                Sin imagen
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800">
                                                {item.nombre}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                S/ {Number(item.precio).toFixed(2)}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => disminuirCantidad(item.id)}
                                                    className="w-8 h-8 bg-slate-100 rounded-lg font-bold"
                                                >
                                                    -
                                                </button>

                                                <span className="font-semibold">
                                                    {item.cantidad}
                                                </span>

                                                <button
                                                    onClick={() => aumentarCantidad(item.id)}
                                                    className="w-8 h-8 bg-slate-100 rounded-lg font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-slate-800">
                                                S/ {(Number(item.precio) * item.cantidad).toFixed(2)}
                                            </p>

                                            <button
                                                onClick={() => eliminarDelCarrito(item.id)}
                                                className="text-red-600 text-sm mt-3 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-slate-200 mt-5 pt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <p className="text-2xl font-bold text-slate-800">
                                Total: S/ {totalCarrito.toFixed(2)}
                            </p>

                            <button
                                onClick={abrirPago}
                                className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
                            >
                                Simular pago
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mostrarPago && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
                    <form
                        onSubmit={confirmarPago}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
                    >
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">
                            Pago simulado
                        </h2>

                        <p className="text-slate-600 mb-4">
                            Estás a punto de pagar:
                        </p>

                        <p className="text-3xl font-bold text-green-700 mb-5">
                            S/ {totalCarrito.toFixed(2)}
                        </p>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nombre del cliente"
                                value={formPago.nombre}
                                onChange={(e) =>
                                    setFormPago({ ...formPago, nombre: e.target.value })
                                }
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                            />

                            <input
                                type="text"
                                placeholder="Número de tarjeta ficticia"
                                value={formPago.tarjeta}
                                onChange={(e) =>
                                    setFormPago({ ...formPago, tarjeta: e.target.value })
                                }
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                            />

                            <input
                                type="text"
                                placeholder="CVV"
                                value={formPago.cvv}
                                onChange={(e) =>
                                    setFormPago({ ...formPago, cvv: e.target.value })
                                }
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="submit"
                                className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold"
                            >
                                Confirmar pago
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setMostrarPago(false);
                                    setMostrarCarrito(true);
                                }}
                                className="bg-slate-500 hover:bg-slate-600 text-white px-5 py-3 rounded-xl font-semibold"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {pagoRealizado && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-green-700 mb-3">
                            Pago realizado
                        </h2>

                        <p className="text-slate-600 mb-5">
                            Gracias por tu compra. Este pago fue simulado correctamente.
                        </p>

                        <button
                            onClick={() => setPagoRealizado(false)}
                            className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CatalogoPlantas;