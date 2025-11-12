// src/pages/Home.jsx
import React from 'react';
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Home.css'; // <-- Importamos nuestro CSS personalizado

// --- VISTA PÚBLICA ---
const HomeLandingPage = () => (
  <>
    {/* Sección Hero */}
    <Container className="hero-section">
      <Row className="align-items-center">
        <Col md={6} className="hero-text">
          <h1 className="display-3 fw-bold">
            Tu Facturación, <span className="text-primary">Simple y Digital.</span>
          </h1>
          <p className="lead text-muted my-4">
            Crea, gestiona y almacena tus boletas y facturas electrónicas.
            Consulta DNI/RUC en tiempo real y maneja tu contabilidad sin esfuerzo.
          </p>
          <Button as={Link} to="/registro" variant="primary" size="lg" className="me-2 shadow">
            Empieza Ahora
          </Button>
          <Button as={Link} to="/login" variant="outline-primary" size="lg">
            Iniciar Sesión
          </Button>
        </Col>
        <Col md={6} className="d-none d-md-block">
          <div className="hero-invoice-container">

            <div className="fake-invoice-card">
              <div className="fake-invoice-header">
                <strong>BOLETA</strong>
                <span>B001-0042</span>
              </div>
              <div className="fake-invoice-body">
                <span className="small text-muted">CLIENTE:</span>
                <div className="fake-line long"></div>
                <div className="fake-line medium"></div>

                <hr className="fake-divider" />

                <div className="fake-item">
                  <div className="fake-line medium"></div>
                  <div className="fake-line short"></div>
                </div>
                <div className="fake-item">
                  <div className="fake-line long"></div>
                  <div className="fake-line short"></div>
                </div>
                <div className="fake-item">
                  <div className="fake-line medium"></div>
                  <div className="fake-line short"></div>
                </div>
              </div>
              <div className="fake-footer">
                <span>TOTAL</span>
                <span className="fake-total">S/ 1,480.00</span>
              </div>
            </div>

          </div>
        </Col>
      </Row>
    </Container>

    {/* Sección de Features */}
    <Container fluid className="features-section">
      <Container>
        <h2 className="text-center fw-bold mb-5">Todo en un solo lugar</h2>
        <Row>
          <Col md={4} className="mb-3">
            <Card className="shadow-sm feature-card h-100">
              <Card.Body className="p-4">
                <h3 className="h5 fw-bold text-primary">Consultas API en Vivo</h3>
                <p>Validamos DNI y RUC al instante contra las bases de datos de Reniec y Sunat para evitar errores.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="shadow-sm feature-card h-100">
              <Card.Body className="p-4">
                <h3 className="h5 fw-bold text-primary">Gestión de Comprobantes</h3>
                <p>Guarda un historial de todas tus boletas y facturas. Desplegado en la nube para acceso desde donde sea.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="shadow-sm feature-card h-100">
              <Card.Body className="p-4">
                <h3 className="h5 fw-bold text-primary">Exporta y Convierte</h3>
                <p>Genera PDFs listos para imprimir y consulta tus totales en Soles (PEN) o Dólares (USD) al instante.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  </>
);

// --- VISTA PRIVADA (DASHBOARD) ---
const HomeDashboard = ({ user }) => (
  <Container className="my-5">
    <Row>
      <Col md={12} className="text-center">
        <h1 className="display-4 fw-bold">¡Hola de nuevo, {user.nombres}!</h1>
        <p className="lead text-muted">¿Qué deseas hacer hoy?</p>
      </Col>
    </Row>
    <Row className="g-4 mt-4 justify-content-center">
      <Col md={4}>
        <Card as={Link} to="/comprobante/crear" className="shadow-sm dashboard-card h-100">
          <Card.Body className="p-5">
            <div className="dashboard-icon">📝</div> {/* Puedes usar iconos de Bootstrap/FontAwesome aquí */}
            <h3 className="h4 fw-bold">Crear Comprobante</h3>
            <p className="text-muted">Genera una nueva boleta o factura.</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card as={Link} to="/comprobante/ver" className="shadow-sm dashboard-card h-100">
          <Card.Body className="p-5">
            <div className="dashboard-icon">📄</div>
            <h3 className="h4 fw-bold">Mis Comprobantes</h3>
            <p className="text-muted">Revisa tu historial de ventas.</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card as={Link} to="/productos" className="shadow-sm dashboard-card h-100">
          <Card.Body className="p-5">
            <div className="dashboard-icon">📦</div>
            <h3 className="h4 fw-bold">Gestionar Productos</h3>
            <p className="text-muted">Edita tu lista de productos.</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);


// --- COMPONENTE PRINCIPAL ---
function Home() {
  const { isLoggedIn, user } = useAuth();

  return (
    // Renderiza una u otra vista dependiendo del estado de login
    isLoggedIn ? <HomeDashboard user={user} /> : <HomeLandingPage />
  );
}

export default Home;