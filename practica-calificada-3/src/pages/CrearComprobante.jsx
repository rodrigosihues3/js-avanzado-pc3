// src/pages/CrearComprobante.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ToggleButtonGroup, ToggleButton, InputGroup, Spinner, Alert, Table, Modal } from 'react-bootstrap';
// ¡Importamos los hooks de React Hook Form!
import { useForm, useFieldArray } from 'react-hook-form';
import apiClient from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getProductos } from '../services/producto.service';
import { createComprobante } from '../services/comprobante.service'; // ¡Importamos el nuevo servicio!

function CrearComprobante() {
  const { user, tipoCambio } = useAuth(); // Obtenemos el tipoCambio
  const navigate = useNavigate();

  // Estados del Cliente
  const [tipoComprobante, setTipoComprobante] = useState('boleta');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Estados del Detalle
  const [catalogoProductos, setCatalogoProductos] = useState([]);

  // Estado de Moneda
  const [moneda, setMoneda] = useState('PEN'); // 'PEN' o 'USD'

  // Estados del Modal
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState(1);

  // --- CONFIGURACIÓN DE REACT HOOK FORM ---
  const { register, handleSubmit, control, setValue, getValues, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      dni: '',
      ruc: '',
      clienteNombres: '',
      clienteApellidos: '',
      clienteRazonSocial: '',
      detalle: [] // El array de items
    }
  });

  // --- 2. CONFIGURACIÓN DEL FIELD ARRAY (para el detalle) ---
  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalle"
  });

  // 'watch' nos permite "observar" el array para recalcular el total en vivo
  const detalleItems = watch("detalle");

  // --- 3. CARGA INICIAL DE DATOS ---
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await getProductos();
        setCatalogoProductos(data);
      } catch (error) { console.error("Error al cargar productos", error); }
    };
    cargarProductos();
  }, []);

  // --- 4. LÓGICA DE BÚSQUEDA DE CLIENTE ---
  const handleSearchCliente = async () => {
    setIsSearching(true);
    setSearchError('');

    const numero = tipoComprobante === 'boleta' ? getValues("dni") : getValues("ruc");
    // Validaciones
    if (tipoComprobante === 'boleta' && user.dni === numero) {
      setSearchError('Error: No puedes generar una boleta para tu propio DNI.');
      setIsSearching(false); return;
    }
    if (tipoComprobante === 'factura' && numero.startsWith("10" + user.dni)) {
      setSearchError('Error: No puedes generar una factura a tu propio RUC.');
      setIsSearching(false); return;
    }
    const endpoint = tipoComprobante === 'boleta' ? `/reniec/${numero}` : `/sunat/${numero}`;


    try {
      const response = await apiClient.get(endpoint);
      const data = response.data; // Aquí está el JSON

      if (tipoComprobante === 'boleta') {
        setValue('clienteNombres', data.first_name);
        setValue('clienteApellidos', `${data.first_last_name} ${data.second_last_name}`);
      } else {
        setValue('clienteRazonSocial', data.razon_social);
      }
    } catch (error) {
      console.log(error);
      // Limpiamos y dejamos editables
      if (tipoComprobante === 'boleta') {
        setSearchError('No se encontraron datos para este DNI. Puedes ingresarlos manualmente.');
        setValue('clienteNombres', '');
        setValue('clienteApellidos', '');
      } else {
        setSearchError('Error: El RUC no existe o no pudo ser validado.');
        setValue('clienteRazonSocial', '');
      }
    } finally {
      setIsSearching(false);
    }
  };

  // --- MANEJADOR DE CAMBIO DE TIPO (Boleta/Factura) ---
  const handleTypeChange = (val) => {
    setTipoComprobante(val);
    // 'reset' limpia todo el formulario, mucho más limpio que 'useState'
    reset();
    setSearchError('');
    setMoneda('PEN');
  };

  const handleMonedaChange = (newMoneda) => {
    const oldMoneda = moneda;
    if (oldMoneda === newMoneda) return; // No hacer nada si la moneda no cambió

    const tc = tipoCambio?.sell_price || 3.4; // Fallback por si la API falla
    const currentDetalle = getValues('detalle');

    const nuevoDetalle = currentDetalle.map(item => {
      let nuevoPrecioUnitario = item.precioUnitario; // 'precioUnitario' es el nombre que usamos

      if (oldMoneda === 'PEN' && newMoneda === 'USD') {
        // Convierte de Soles a Dólares
        nuevoPrecioUnitario = item.precioUnitario / tc;
      } else if (oldMoneda === 'USD' && newMoneda === 'PEN') {
        // Convierte de Dólares a Soles
        nuevoPrecioUnitario = item.precioUnitario * tc;
      }

      return {
        ...item,
        precioUnitario: nuevoPrecioUnitario
      };
    });

    // Actualiza el estado de la moneda y el formulario
    setMoneda(newMoneda);
    setValue('detalle', nuevoDetalle);
  };

  // --- LÓGICA DEL DETALLE ---
  const getPrecioBase = (precioProducto) => {
    // Si la moneda es PEN, usamos el precio tal cual.
    if (moneda === 'PEN') return precioProducto;
    // Si es USD, convertimos el precio (que está en S/) a dólares.
    return precioProducto / (tipoCambio?.sell_price || 3.4); // Usamos un fallback
  };

  const handleAgregarExistente = () => {
    const producto = catalogoProductos.find(p => p.id == productoSeleccionado);
    if (!producto || cantidadProducto < 1) return;

    // 'append' (de useFieldArray) añade el objeto al formulario
    append({
      productoId: producto.id,
      descripcion: producto.nombre,
      cantidad: parseInt(cantidadProducto),
      precioUnitario: getPrecioBase(producto.precio),
      esEditable: true
    });

    setShowModal(false);
    setProductoSeleccionado('');
    setCantidadProducto(1);
  };

  const handleAgregarNuevo = () => {
    append({
      productoId: null,
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0.00,
      esEditable: true
    });
  };

  // --- 6. CÁLCULOS ---
  const calcularTotal = () => {
    return detalleItems.reduce((total, item) => total + (item.cantidad * item.precioUnitario), 0);
  };


  // --- 7. ACCIÓN FINAL: GUARDAR BOLETA ---
  // Esta función es llamada por 'handleSubmit' SOLO si el formulario es válido
  const onSubmit = async (data) => {
    if (data.detalle.length === 0) {
      alert('Debe agregar al menos un producto al detalle.');
      return;
    }

    const totalEnMonedaSeleccionada = calcularTotal();
    const tc = tipoCambio?.sell_price || 3.4;
    const esDolares = moneda === 'USD';

    // Objeto final (¡Importante! Usamos 'user.nombres' para estampar al creador)
    const comprobanteFinal = {
      serie: tipoComprobante === 'boleta' ? 'B001' : 'F001',
      numero: Math.floor(Math.random() * 9000) + 1000,
      fechaEmision: new Date().toISOString().split('T')[0],

      moneda: moneda,
      tipoCambio: esDolares ? tc : null,

      cliente: {
        tipoDoc: tipoComprobante === 'boleta' ? 'DNI' : 'RUC',
        numeroDoc: tipoComprobante === 'boleta' ? data.dni : data.ruc,
        nombre: tipoComprobante === 'boleta' ? `${data.clienteNombres} ${data.clienteApellidos}` : data.clienteRazonSocial
      },

      detalle: data.detalle,

      totales: totalEnMonedaSeleccionada.toFixed(2)
    };

    // --- 4. CÓDIGO DE GUARDADO ACTIVADO ---
    try {
      const nuevoComprobante = await createComprobante(comprobanteFinal); // Usamos el servicio renombrado
      alert('Comprobante generado con éxito!');
      // Te redirige a la página de detalle (que haremos después)
      navigate(`/comprobante/${nuevoComprobante.id}`); // (Recuerda ajustar esta ruta si también la renombras)
    } catch (error) {
      alert('Error al guardar el comprobante en el backend.');
      console.log(error);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={9}>
          {/* 8. handleSubmit se encarga de la validación antes de llamar a onSubmit */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            {searchError && <Alert variant="danger" className="mt-3">{searchError}</Alert>}
            <Card className="shadow-sm">
              <Card.Header className="text-center"><h2 className="h4 mb-0">Generar Nuevo Comprobante</h2></Card.Header>
              <Card.Body className="p-4">

                {/* Selector de Tipo */}
                <ToggleButtonGroup type="radio" name="tipoComprobante" value={tipoComprobante} onChange={handleTypeChange} className="w-100 mb-4">
                  <ToggleButton id="tbg-boleta" value={'boleta'} variant="outline-primary" size="lg">Boleta</ToggleButton>
                  <ToggleButton id="tbg-factura" value={'factura'} variant="outline-primary" size="lg">Factura</ToggleButton>
                </ToggleButtonGroup>

                {/* --- CLIENTE --- */}
                <fieldset className="border p-3 rounded mb-4">
                  <legend className="float-none w-auto px-2 h6">Datos del Cliente</legend>
                  {tipoComprobante === 'boleta' ? (
                    <>
                      <Form.Group as={Row} className="mb-3"><Form.Label column sm={3}>DNI</Form.Label>
                        <Col sm={9}>
                          <InputGroup>
                            <Form.Control type="text" {...register("dni", {
                              required: "El DNI es obligatorio",
                              minLength: { value: 8, message: "Debe tener 8 dígitos" },
                              maxLength: { value: 8, message: "Debe tener 8 dígitos" },
                              pattern: { value: /^[0-9]+$/, message: "Solo números" }
                            })} isInvalid={!!errors.dni} />
                            <Button variant="outline-primary" onClick={handleSearchCliente} disabled={isSearching}>{isSearching ? <Spinner size="sm" /> : 'Buscar'}</Button>
                          </InputGroup>
                          {errors.dni && <small className="text-danger mt-1">{errors.dni.message}</small>}
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3"><Form.Label column sm={3}>Nombres</Form.Label>
                        <Col sm={9}><Form.Control type="text" {...register("clienteNombres", { required: true })} readOnly={!searchError} className={!searchError ? 'bg-light' : ''} /></Col>
                      </Form.Group>
                      <Form.Group as={Row}><Form.Label column sm={3}>Apellidos</Form.Label>
                        <Col sm={9}><Form.Control type="text" {...register("clienteApellidos", { required: true })} readOnly={!searchError} className={!searchError ? 'bg-light' : ''} /></Col>
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Form.Group as={Row} className="mb-3"><Form.Label column sm={3}>RUC</Form.Label>
                        <Col sm={9}>
                          <InputGroup>
                            <Form.Control type="text" {...register("ruc", {
                              required: "El RUC es obligatorio",
                              minLength: { value: 11, message: "Debe tener 11 dígitos" },
                              maxLength: { value: 11, message: "Debe tener 11 dígitos" },
                              pattern: { value: /^[0-9]+$/, message: "Solo números" }
                            })} isInvalid={!!errors.ruc} />
                            <Button variant="outline-primary" onClick={handleSearchCliente} disabled={isSearching}>{isSearching ? <Spinner size="sm" /> : 'Buscar'}</Button>
                          </InputGroup>
                          {errors.ruc && <small className="text-danger mt-1">{errors.ruc.message}</small>}
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}><Form.Label column sm={3}>Razón Social</Form.Label>
                        <Col sm={9}><Form.Control type="text" {...register("clienteRazonSocial", { required: true })} readOnly /></Col>
                      </Form.Group>
                    </>
                  )}
                </fieldset>

                {/* --- DETALLE DE PRODUCTOS --- */}
                <fieldset className="border p-3 rounded">
                  <legend className="float-none w-auto px-2 h6">Detalle de Venta</legend>
                  {/* Botones de agregar productos */}
                  <div className="d-flex gap-2 mb-3 justify-content-between">
                    <div className="d-flex gap-2">
                      <Button variant="success" onClick={() => setShowModal(true)}>+ Agregar Existente</Button>
                      <Button variant="info" onClick={handleAgregarNuevo}>+ Agregar Nuevo</Button>
                    </div>

                    <div>
                      {/* --- SELECTOR DE MONEDA --- */}
                      <Row>
                        <Col>
                          <ToggleButtonGroup
                            type="radio"
                            name="moneda"
                            value={moneda}
                            onChange={handleMonedaChange}
                          >
                            <ToggleButton id="tbg-pen" value={'PEN'} variant="outline-danger">
                              Soles (PEN)
                            </ToggleButton>
                            <ToggleButton id="tbg-usd" value={'USD'} variant="outline-success">
                              Dólares (USD)
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {/* Tabla de detalle */}
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>P. Unitario {moneda}</th>
                        <th className="text-end">Subtotal {moneda}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* 10. Iteramos sobre 'fields' de useFieldArray */}
                      {fields.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <Form.Control
                              type="text"
                              {...register(`detalle.${index}.descripcion`, { required: true, minLength: 1})}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              {...register(`detalle.${index}.cantidad`, { valueAsNumber: true, min: 1 })}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              step="0.00000000001"
                              {...register(`detalle.${index}.precioUnitario`, { valueAsNumber: true, min: 0.01 })}
                            />
                          </td>
                          <td className="align-middle text-end">
                            {/* 11. 'watch' actualiza el subtotal en vivo */}
                            {moneda === 'PEN' ? 'S/' : '$'}
                            {(watch(`detalle.${index}.cantidad`) * watch(`detalle.${index}.precioUnitario`) || 0).toFixed(2)}
                          </td>
                          <td className="align-middle text-center">
                            <Button variant="outline-danger" size="sm" onClick={() => remove(index)}>X</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {fields.length > 0 && (
                    <div className="text-end fw-bold fs-4">
                      TOTAL:&nbsp;
                      <span className="text-primary float-end">
                        {moneda === 'PEN' ? 'S/' : '$'} {calcularTotal().toFixed(2)}
                      </span>
                    </div>
                  )}
                </fieldset>

                <div className="text-center mt-4">
                  <Button type="submit" variant="primary" size="lg">Generar Comprobante</Button>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>

      {/* --- MODAL (sin cambios) --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Agregar Producto Existente</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Seleccionar Producto</Form.Label>
            <Form.Select value={productoSeleccionado} onChange={e => setProductoSeleccionado(e.target.value)}>
              <option value="">-- Elija un producto --</option>
              {catalogoProductos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control type="number" value={cantidadProducto} onChange={e => setCantidadProducto(e.target.value)} min="1" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAgregarExistente}>Agregar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CrearComprobante;