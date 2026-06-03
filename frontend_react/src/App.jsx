import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CatalogoPlantas from "./pages/CatalogoPlantas";
import TipoPlantaList from "./pages/TipoPlantaList";
import TipoPlantaForm from "./pages/TipoPlantaForm";
import PlantaList from "./pages/PlantaList";
import PlantaForm from "./pages/PlantaForm";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<CatalogoPlantas />} />

        <Route path="/tipos-plantas" element={<TipoPlantaList />} />
        <Route path="/tipos-plantas/nuevo" element={<TipoPlantaForm />} />
        <Route path="/tipos-plantas/editar/:id" element={<TipoPlantaForm />} />

        <Route path="/plantas" element={<PlantaList />} />
        <Route path="/plantas/nuevo" element={<PlantaForm />} />
        <Route path="/plantas/editar/:id" element={<PlantaForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;