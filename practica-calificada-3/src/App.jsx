import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Importa las páginas
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import CrearComprobante from './pages/CrearComprobante.jsx';
import VerComprobantes from './pages/VerComprobantes.jsx';
import DetalleComprobante from './pages/DetalleComprobante.jsx';
import Productos from './pages/Productos.jsx';

// Importar los componentes
import AppNavbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

function App() {
  return (
    <div className="app-wrapper">
      <AppNavbar />

      <main className="content-wrapper">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas Protegidas (anidadas dentro de ProtectedRoute) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/comprobante/crear" element={<CrearComprobante />} />
            <Route path="/comprobante/ver" element={<VerComprobantes />} />
            <Route path="/comprobante/:id" element={<DetalleComprobante />} />
            <Route path="/productos" element={<Productos />} />
          </Route>

          {/* Ruta 404 */}
          {/* Redirige cualquier ruta no existente a la página de inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer className="footer-wrapper" />
    </div>
  )
}

export default App
