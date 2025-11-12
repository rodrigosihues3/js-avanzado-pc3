import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js'; // hook de autenticación
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'; // Componentes de diseño

function Login() {
  // Estados para guardar los datos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Funciones del Contexto
  const auth = useAuth();
  const navigate = useNavigate(); // Hook para redirigir

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setError(''); // Limpia errores anteriores

    try {
      const success = await auth.login(email, password);

      if (success) {
        navigate('/');
      } else {
        setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      setError(err);
    }
  };

  // La vista
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center fw-bold mb-4">Iniciar Sesión</h2>

              {/* Muestra un mensaje de error si existe */}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Ingresar
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>
                  ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;