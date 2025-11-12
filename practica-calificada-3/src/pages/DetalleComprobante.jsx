import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom'; // useParams para leer el ID de la URL
import { getComprobanteById } from '../services/comprobante.service';
import jsPDF from 'jspdf'; // Importamos jsPDF

function DetalleComprobante() {
  const [comprobante, setComprobante] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Estados para los cálculos ---
  const [subtotal, setSubtotal] = useState(0);
  const [igv, setIgv] = useState(0);
  const [total, setTotal] = useState(0);
  const [monedaSimbolo, setMonedaSimbolo] = useState('S/');

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const cargarDato = async () => {
        try {
          const data = await getComprobanteById(id);
          setComprobante(data);
          calcularTotalesLegales(data);
        } catch (err) {
          setError('No se pudo encontrar el comprobante.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      cargarDato();
    }
  }, [id]);

  // --- FUNCIÓN DE CÁLCULO ---
  const calcularTotalesLegales = (c) => {

    // 1. Leemos el total "en bruto" (Op. Gravada) que guardaste en 'totales'
    // Tu lógica es correcta.
    const total = parseFloat(c.totales);
    const opGravada = total / 1.18;

    // 2. Verificamos que sea un número válido
    if (isNaN(opGravada)) {
      console.error("Error: El total del comprobante no es un número.", c);
      setError("Error al calcular totales, datos de origen inválidos.");
      return;
    }

    // 3. Calculamos el IGV y el Total Final
    const igv = opGravada * 0.18;

    // 4. Guardamos los 3 valores en el estado para que el JSX los use
    setSubtotal(opGravada);    // Tu JSX usa 'subtotal' para la Op. Gravada
    setIgv(igv);    // Tu JSX usa 'igv'
    setTotal(total);  // Tu JSX usa 'total' para el Total Final
    setMonedaSimbolo(c.moneda === 'USD' ? '$' : 'S/');
  };

  // 2. Función para generar PDF (copiada de tu componente de Angular)
  const generarPDF = () => {
    const doc = new jsPDF();
    const c = comprobante; // alias
    const simbolo = monedaSimbolo;

    const fechaFormateada = new Date(c.fechaEmision).toLocaleDateString('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    doc.setFontSize(20); doc.text(c.cliente.tipoDoc === 'DNI' ? 'BOLETA DE VENTA' : 'FACTURA DE VENTA', 105, 20, { align: 'center' });
    doc.setFontSize(12); doc.text(`Nº: ${c.serie}-${c.numero}`, 105, 30, { align: 'center' });
    doc.text(`Cliente: ${c.cliente.nombre}`, 15, 50);
    doc.text(`Doc: ${c.cliente.numeroDoc}`, 15, 57);
    doc.text(`Fecha: ${fechaFormateada}`, 150, 57);
    if (c.moneda === 'USD') {
      doc.text(`Tipo Cambio: ${c.tipoCambio}`, 150, 64);
    }

    let y = 75;
    doc.text('Cant.', 15, y); doc.text('Descripción', 40, y);
    doc.text(`V. Unit. (${simbolo})`, 150, y, { align: 'right' });
    doc.text(`Subtotal (${simbolo})`, 180, y, { align: 'right' });
    y += 10;

    c.detalle.forEach(item => {
      const itemSubtotal = (item.cantidad * item.precioUnitario) / 1.18;
      doc.text(String(item.cantidad), 15, y);
      doc.text(item.descripcion, 40, y);
      doc.text((item.precioUnitario / 1.18).toFixed(2), 150, y, { align: 'right' });
      doc.text(itemSubtotal.toFixed(2), 180, y, { align: 'right' });
      y += 7;
    });

    y += 10;
    // Usamos los totales calculados y guardados en el estado
    doc.text(`Op. Gravada: ${simbolo} ${subtotal.toFixed(2)}`, 180, y, { align: 'right' });
    y += 7;
    doc.text(`IGV (18%): ${simbolo} ${igv.toFixed(2)}`, 180, y, { align: 'right' });
    y += 7;
    doc.setFontSize(14);
    doc.text(`TOTAL: ${simbolo} ${total.toFixed(2)}`, 180, y, { align: 'right' });

    doc.save(`comprobante-${c.serie}-${c.numero}.pdf`);
  };

  // --- Renderizado del componente ---
  if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
  if (error) return <Container><Alert variant="danger" className="mt-5">{error}</Alert></Container>;
  if (!comprobante) return null; // Si no hay comprobante (y no hay error), no muestra nada

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg">
            <Card.Body className="p-4 p-md-5">

              {/* Encabezado */}
              <div className="d-flex justify-content-between align-items-start pb-4 border-bottom">
                <div>
                  <h2 className="fw-bold text-primary">PC3 S.A.C.</h2>
                  <p className="text-muted mb-0">RUC: 10746639287</p>
                </div>
                <div className="text-end">
                  <h3 className="h4">{comprobante.cliente.tipoDoc === 'DNI' ? 'BOLETA' : 'FACTURA'} DE VENTA</h3>
                  <p className="fs-5 fw-bold">{comprobante.serie}-{comprobante.numero}</p>
                </div>
              </div>

              {/* Cliente y Fecha */}
              <Row className="pt-4">
                <Col md={6}>
                  <h4 className="h6">CLIENTE</h4>
                  <p className="mb-0">{comprobante.cliente.nombre}</p>
                  <p className="text-muted mb-0">{comprobante.cliente.tipoDoc}: {comprobante.cliente.numeroDoc}</p>
                </Col>
                <Col md={6} className="text-md-end mt-3 mt-md-0">
                  <h4 className="h6">FECHA DE EMISIÓN</h4>
                  <p className="mb-0">
                    {new Date(comprobante.fechaEmision).toLocaleDateString('es-PE', {
                      day: '2-digit', month: '2-digit', year: 'numeric'
                    })}
                  </p>
                  {/* Mostramos la moneda y el T.C. si es USD */}
                  <h4 className="h6 mt-2">MONEDA</h4>
                  <p className="mb-0">
                    {comprobante.moneda}
                    {comprobante.tipoCambio && ` (T.C. ${comprobante.tipoCambio})`}
                  </p>
                </Col>
              </Row>

              {/* Tabla de Detalle */}
              <Table responsive className="mt-4">
                <thead className="table-light">
                  <tr>
                    <th>Cant.</th>
                    <th>Descripción</th>
                    <th className="text-end">V. Unit. ({monedaSimbolo})</th>
                    <th className="text-end">Subtotal ({monedaSimbolo})</th>
                  </tr>
                </thead>
                <tbody>
                  {comprobante.detalle.map((item, index) => (
                    <tr key={index}>
                      <td>{item.cantidad}</td>
                      <td>{item.descripcion}</td>
                      {/* Vemos el V.U. en la moneda guardada */}
                      <td className="text-end">{monedaSimbolo} {(parseFloat(item.precioUnitario) / 1.18).toFixed(2)}</td>
                      {/* Vemos el Subtotal en la moneda guardada */}
                      <td className="text-end">{monedaSimbolo} {((parseInt(item.cantidad) * (parseFloat(item.precioUnitario).toFixed(2))) / 1.18).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Totales */}
              <Row className="justify-content-end mt-4">
                <Col md={5} lg={4}>
                  <div className="d-flex justify-content-between"><span className="text-muted">Op. Gravada:</span><span>{monedaSimbolo} {subtotal.toFixed(2)}</span></div>
                  <div className="d-flex justify-content-between"><span className="text-muted">IGV (18%):</span><span>{monedaSimbolo} {igv.toFixed(2)}</span></div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5"><span >TOTAL:</span><span className="text-primary">{monedaSimbolo} {total.toFixed(2)}</span></div>
                </Col>
              </Row>

              {/* Botones de Acción */}
              <div className="text-center mt-5 d-flex justify-content-center gap-2">
                <Link to="/comprobante/ver" className="btn btn-secondary">
                  Volver al Listado
                </Link>
                <Button variant="success" onClick={generarPDF}>
                  Descargar PDF
                </Button>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DetalleComprobante;