import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">
          🌱 Catálogo de Plantas
        </h1>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/"
            className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg transition"
          >
            Catálogo
          </Link>

          <Link
            to="/tipos-plantas"
            className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg transition"
          >
            Tipos de plantas
          </Link>

          <Link
            to="/plantas"
            className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg transition"
          >
            Plantas
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;