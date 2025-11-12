// src/pages/Registro.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Nuestro hook de autenticación
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

function Registro() {
  // 1. Estados para cada campo del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const auth = useAuth();
  const navigate = useNavigate();

  // 2. Manejador para actualizar el estado del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Manejador del envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones simples
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      // 4. Llama a la función register de nuestro AuthContext
      const success = await auth.register({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        dni: formData.dni,
        email: formData.email,
        password: formData.password
      });

      if (success) {
        setSuccess('¡Registro exitoso! Serás redirigido al login.');
        // Redirige al login después de 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Error en el registro. Es posible que el DNI o email ya existan.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      setError(err);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100">
        <Col md={8} lg={6} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center fw-bold mb-4">Crear Cuenta</h2>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formNombres">
                      <Form.Label>Nombres</Form.Label>
                      <Form.Control type="text" name="nombres" onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formApellidos">
                      <Form.Label>Apellidos</Form.Label>
                      <Form.Control type="text" name="apellidos" onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="formDNI">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control type="text" name="dni" maxLength="8" onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control type="email" name="email" onChange={handleChange} required />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPassword">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control type="password" name="password" onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                      <Form.Label>Confirmar Contraseña</Form.Label>
                      <Form.Control type="password" name="confirmPassword" onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Registrarse
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>
                  ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Registro;