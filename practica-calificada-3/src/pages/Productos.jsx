// src/pages/Productos.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form'; // Importamos React Hook Form
import { getProductos, createProducto } from '../services/producto.service';

function Productos() {
  // Estado para la lista de productos
  const [productos, setProductos] = useState([]);
  // Estados para la UI (carga y errores)
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Configuración de React Hook Form para el formulario de nuevo producto
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // --- Carga Inicial de Datos ---
  useEffect(() => {
    cargarProductos();
  }, []); // El array vacío [] asegura que se ejecute solo una vez al cargar

  const cargarProductos = async () => {
    try {
      setIsLoading(true);
      setListError('');
      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      setListError('Error al cargar el catálogo de productos.');
      setListError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Manejador para Crear Producto ---
  const onSubmit = async (data) => {
    try {
      setSubmitError('');
      // 1. Llama al servicio del frontend, que llama al backend
      const nuevoProducto = await createProducto(data);

      // 2. Actualiza la lista en la UI al instante
      setProductos(prevProductos => [...prevProductos, nuevoProducto]);
      reset(); // 3. Limpia el formulario
    } catch (err) {
      // 4. Muestra el error del backend (ej. "Ya existe un producto con ese nombre")
      setSubmitError(err.message || 'Error al guardar el producto.');
    }
  };

  return (
    <Container className="my-5">
      <Row className="g-4">

        {/* === Columna 1: Formulario para Agregar Producto === */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Header>
              <h4 className="h5 mb-0">Agregar Nuevo Producto</h4>
            </Card.Header>
            <Card.Body>
              {/* Usamos el handleSubmit de React Hook Form */}
              <Form onSubmit={handleSubmit(onSubmit)}>

                {submitError && <Alert variant="danger" size="sm">{submitError}</Alert>}

                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label>Nombre del Producto</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                    isInvalid={!!errors.nombre} // Muestra el borde rojo si hay error
                  />
                  {/* Mensaje de error de validación */}
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="precio">
                  <Form.Label>Precio (S/)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    {...register("precio", {
                      required: "El precio es obligatorio",
                      valueAsNumber: true,
                      min: { value: 0.01, message: "El precio debe ser mayor a 0" }
                    })}
                    isInvalid={!!errors.precio}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.precio?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="descripcion">
                  <Form.Label>Descripción (Opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register("descripcion")} // No es requerido
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Guardar Producto
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* === Columna 2: Lista de Productos === */}
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header>
              <h4 className="h5 mb-0">Catálogo General de Productos</h4>
            </Card.Header>
            <Card.Body>
              {isLoading && (
                <div className="text-center p-3">
                  <Spinner animation="border" />
                  <p>Cargando productos...</p>
                </div>
              )}

              {listError && <Alert variant="danger">{listError}</Alert>}

              {!isLoading && !listError && (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.length > 0 ? (
                      productos.map((producto, index) => (
                        <tr key={producto.id}>
                          <td>{index + 1}</td>
                          <td>{producto.nombre}</td>
                          <td>S/ {producto.precio.toFixed(2)}</td>
                          <td>{producto.descripcion}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          El catálogo de productos está vacío.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Productos;