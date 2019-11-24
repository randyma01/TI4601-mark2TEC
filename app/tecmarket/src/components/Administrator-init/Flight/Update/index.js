import React from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';

class Flight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrives: '',
      capacityPlane: '',
      code: '',
      departure: '',
      flight: [],
      landing: '',
      price: '',
      restriction: '',
      restrictions: [],
      service: '',
      services: [],
      state: '',
      takeOff: ''
    };
  }

  _handleChangeArrive(event) {
    this.setState({ arrives: event.target.value })
  }

  _handleChangeCapacityPlane(event) {
    this.setState({ capacityPlane: event.target.value })
  }

  _handleChangeCode(event) {
    this.setState({ code: event.target.value })
  }

  _handleChangeDeparture(event) {
    this.setState({ departure: event.target.value })
  }

  _handleChangePrice(event) {
    this.setState({ price: event.target.value })
  }

  _handleChangeRestriction(event) {
    this.setState({ restriction: event.target.value })
  }

  _handleChangeService(event) {
    this.setState({ service: event.target.value })
  }

  _handleChangeSelectLanding(event) {
    this.setState({
      landing: event.target.value
    })
  }

  _handleChangeSelectState(event) {
    this.setState({
      state: event.target.value
    })
  }

  _handleChangeSelectTakeOff(event) {
    this.setState({
      takeOff: event.target.value
    })
  }

  _onClckAddRestrictions = () => {
    if (this.state.restriction !== '') {
      this.setState({
        restrictions: [...this.state.restrictions, this.state.restriction],
        restriction: ''
      })
    }
  }

  _onClckAddServices = () => {
    if (this.state.service !== '') {
      this.setState({
        services: [...this.state.services, this.state.service],
        service: ''
      })
    }
  }

  _onClickDeleteRestricion(restriction) {
    this.setState(state => {
      const tempRestricions = state.restrictions.filter(item => item !== restriction);
      state.restrictions = tempRestricions;
      return {
        tempRestricions
      };
    });
  }

  _onClickDeleteService(service) {
    this.setState(state => {
      const tempServices = state.services.filter(item => item !== service);
      state.services = tempServices;
      return {
        tempServices
      };
    });
  }

  _onClickSearchFlight = async () => {
    if (this.state.code === '') {
      window.confirm("Debe ingresar un código de aeropuerto para modificar.")
    } else {
      await fetch(`http://localhost:3000/admin/findFlightsId/${this.state.code}`,
        {
          method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson !== '') {
            this.setState({
              flight: responseJson,
              restrictions: responseJson.restrictions,
              services: responseJson.services,
              code: ''
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  _submitData = async () => {
    if (this.state.restrictions.length === 0 || this.state.services === 0) {
      window.confirm("Debe ingresar los campos restricciones y servicios.")
    }
    else if (this.state.departure === '' || this.state.arrives === '' ||
      this.state.origin === '' || this.state.destination === '') {
      window.confirm("Debe ingresar origen, destino, salida y llegada validos.")
    }
    else if (this.state.state === '') {
      window.confirm("Debe indicar el estado del vuelo.")
    }
    else if (this.state.price === '' || this.state.capacityPlane === '') {
      window.confirm("Debe ingresar el precio o capacidad permitida con datos validos.")
    }
    else {
      let data = {
        arrives: this.state.arrives,
        capacityPlane: this.state.capacityPlane,
        departure: this.state.departure,
        landing: this.state.landing,
        price: this.state.price,
        restrictions: this.state.restrictions,
        services: this.state.services,
        state: this.state.state,
        takeOff: this.state.takeOff
      }
      await fetch(`http://localhost:3000/admin/updateFlight/${this.state.flight._id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson._id === this.state.flight._id) {
            this.setState({ arrives: '', flight: [], capacityPlane: '', departure: '', price: '', state: '', restrictions: [], services: [] })
            window.confirm("Se actualizado correctamente el vuelo.")
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  render() {
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h3 align='center'>Actualizar Vuelo</h3>
        </div>
        <Row className='justify-content-md-center'>
          <Col xs lg='2'></Col>
          <Col md='auto'>
            <Form>
              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Col} controlId='formGridName'>
                  <Form.Label>Código</Form.Label>
                  <Form.Control type='string' placeholder='Código de vuelo por modificar' value={this.state.code} onChange={this._handleChangeCode.bind(this)} />
                </Form.Group>
                <Form.Group as={Col} controlId='formGridButton'>
                  <Button onClick={this._onClickSearchFlight}>Buscar</Button>
                </Form.Group>
              </Form.Row>
            </Form>
            <Form>
              <Form.Row style={{ marginTop: '4%' }}>
                <Form.Group as={Col} controlId="ControlSelectOrigin" >
                  <Form.Label>Aerolinea</Form.Label>
                  <Form.Control type='string' placeholder={this.state.flight.airline_id} disabled />
                </Form.Group>
                <Form.Group as={Col} controlId='formGridId'>
                  <Form.Label>Codigo de vuelo</Form.Label>
                  <Form.Control type='string' placeholder={this.state.flight._id} disabled />
                </Form.Group>
                <Form.Group as={Col} controlId='formGridName'>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type='string' placeholder={this.state.flight.name} disabled />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ marginTop: '4%' }}>
                <Form.Group as={Col} controlId="ControlSelectOrigin">
                  <Form.Label>Origen</Form.Label>
                  <Form.Control type='string' placeholder={this.state.flight.origin} disabled />
                </Form.Group>
                <Form.Group as={Col} controlId="ControlSelectDestination">
                  <Form.Label>Destino</Form.Label>
                  <Form.Control type='string' placeholder={this.state.flight.destination} disabled />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ marginTop: '4%' }}>
                <Form.Group as={Col} controlId="ControlSelectDeparture">
                  <Form.Label>Itinerario - Salida ({this.state.flight.takeOff} a {this.state.flight.departure})</Form.Label>
                  <Form.Control type="date"  value={this.state.takeOff} onChange={this._handleChangeSelectTakeOff.bind(this)} />
                  <Form.Control type="time"  value={this.state.departure} onChange={this._handleChangeDeparture.bind(this)} />
                </Form.Group>
                <Form.Group as={Col} controlId="ControlSelectArrives">
                  <Form.Label>Itinerario - Llegada ({this.state.flight.landing} a {this.state.flight.arrives})</Form.Label>
                  <Form.Control type="date"  value={this.state.landing} onChange={this._handleChangeSelectLanding.bind(this)} />
                  <Form.Control type="time"  value={this.state.arrives} onChange={this._handleChangeArrive.bind(this)} />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ marginTop: '4%' }}>
                <Form.Group as={Col} controlId='formGridId'>
                  <Form.Label>Precio ($)</Form.Label>
                  <Form.Control type='string' placeholder={this.state.flight.price} value={this.state.price} onChange={this._handleChangePrice.bind(this)} />
                </Form.Group>
                <Form.Group as={Col} controlId='formGridName'>
                  <Form.Label>Capacidad máxima</Form.Label>
                  <Form.Control type='number' placeholder={this.state.flight.capacityPlane} value={this.state.capacityPlane} onChange={this._handleChangeCapacityPlane.bind(this)} />
                </Form.Group>
                <Form.Group as={Col} controlId="ControlSelectState">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control as="select" defaultValue={this.state.flight.state} onChange={this._handleChangeSelectState.bind(this)}>
                    <option value={'A tiempo'}>A Tiempo</option>
                    <option value={'Retrasado'}>Retrasado</option>
                    <option value={'Cancelado'}>Cancelado</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ marginTop: '4%' }}>
                <Form.Group as={Col} controlId='formGridId'>
                  <Form.Label>Restricciones</Form.Label>
                  <Form.Control type='string' placeholder='Restriccion de vuelo' value={this.state.restriction} onChange={this._handleChangeRestriction.bind(this)} />
                  <Fab style={{ marginTop: '2%' }} variant="extended" aria-label="add" onClick={this._onClckAddRestrictions}>
                    <AddIcon />
                    Agregar Restricción
                      </Fab>
                  <div style={{ overflow: 'auto', height: '200px' }}>
                    <Table striped bordered hover responsive >
                      <thead>
                        <tr>
                          <th>Restricción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.restrictions.map((item, index) => (
                          <tr key={index}>
                            <td>{item}</td>
                            <td>
                              <IconButton aria-label="delete" style={{ color: 'red' }} onClick={this._onClickDeleteRestricion.bind(this, item)}>
                                <DeleteIcon />
                              </IconButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Form.Group>
                <Form.Group as={Col} controlId='formGridName'>
                  <Form.Label>Servicios</Form.Label>
                  <Form.Control type='string' placeholder='Servicios ofrecidos' value={this.state.service} onChange={this._handleChangeService.bind(this)} />
                  <Fab style={{ marginTop: '2%' }} variant="extended" aria-label="add" onClick={this._onClckAddServices}>
                    <AddIcon />
                    Agregar Servicio
                      </Fab>
                  <div style={{ overflow: 'auto', height: '200px' }}>
                    <Table striped bordered hover responsive >
                      <thead>
                        <tr>
                          <th>Servicio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.services.map((item, index) => (
                          <tr key={index}>
                            <td>{item}</td>
                            <td>
                              <IconButton aria-label="delete" style={{ color: 'red' }} onClick={this._onClickDeleteService.bind(this, item)}>
                                <DeleteIcon />
                              </IconButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Form.Group>
              </Form.Row>

            </Form>
          </Col>
          <Col xs lg='2'></Col>
        </Row>

        <Row className='justify-content-md-center' style={{ margin: '3%' }}>
          <Button
            variant='primary'
            size='lg'
            onClick={this._submitData}>
            Confirmar
          </Button>
        </Row>
      </Container>
    );
  }
}


export default Flight;
