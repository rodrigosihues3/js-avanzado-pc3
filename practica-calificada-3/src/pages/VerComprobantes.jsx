import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getComprobantes } from '../services/comprobante.service';

function VerComprobantes() {
  const [comprobantes, setComprobantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getComprobantes();
        setComprobantes(data);
      } catch (err) {
        setError('Error al cargar el historial de comprobantes.');
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light text-center">
              <h2 className="h4 mb-0">Historial de Comprobantes</h2>
            </Card.Header>
            <Card.Body>

              {isLoading && (
                <div className="text-center p-4"><Spinner /> <p>Cargando...</p></div>
              )}

              {error && <Alert variant="danger">{error}</Alert>}

              {!isLoading && !error && (
                <ListGroup variant="flush">
                  {comprobantes.length > 0 ? (
                    comprobantes.map(comprobante => (
                      <ListGroup.Item key={comprobante.id} className="d-flex justify-content-between align-items-center flex-wrap">
                        <div className="me-3">
                          <h5 className="mb-1 fw-bold">{comprobante.serie}-{comprobante.numero}</h5>
                          <p className="mb-1 text-muted">Cliente: {comprobante.cliente.nombre}</p>
                          {/* CORRECCIÓN 1: Formateamos la fecha y eliminamos 'creadoPor' */}
                          <small className="text-muted">
                            Fecha: {new Date(comprobante.fechaEmision).toLocaleDateString('es-PE')}
                          </small>
                        </div>
                        <div className="text-end">
                          <span className="d-block fs-5 fw-bold text-primary">
                            {/* CORRECCIÓN 2: Calculamos el total y mostramos la moneda */}
                            {comprobante.moneda === 'USD' ? '$' : 'S/'}
                            {parseFloat(comprobante.totales).toFixed(2)}
                          </span>
                          {/* (Asegúrate de que tu ruta en App.jsx sea /comprobantes/:id) */}
                          <Link to={`/comprobante/${comprobante.id}`} className="btn btn-sm btn-outline-primary mt-1">
                            Ver Detalle
                          </Link>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <Alert variant="info" className="text-center">No se han generado comprobantes todavía.</Alert>
                  )}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default VerComprobantes;