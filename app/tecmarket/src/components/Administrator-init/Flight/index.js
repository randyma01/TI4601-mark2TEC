import React from 'react';
import { Button, Col, Container, Form, Row, Spinner, Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

/*Tabs*/
import DeleteFlight from './Delete';
import ReadFlight from './Read';
import UpdateFlight from './Update';


class Flight extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      airline_id: '',
      arrives: '',
      capacityPlane: '',
      countriesByAirline: [],
      departure: '',
      destination: '',
      destinationCountry: '',
      id: '',
      landing: '',
      listAirlines: [],
      listCitiesDestination: [],
      listCitiesOrigin: [],
      name: '',
      origin: '',
      originCountry: '',
      price: '',
      restriction: '',
      restrictions: [],
      service: '',
      services: [],
      state: '',
      takeOff: ''
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    await fetch('http://localhost:3000/admin/findAllAirlines/',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            listAirlines: responseJson
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _handleChangeArrive(event) {
    this.setState({ arrives: event.target.value })
  }

  _handleChangeCapacityPlane(event) {
    this.setState({ capacityPlane: event.target.value })
  }

  _handleChangeDeparture(event) {
    this.setState({ departure: event.target.value })
  }

  _handleChangeId(event) {
    this.setState({ id: event.target.value })
  }

  _handleChangeName(event) {
    this.setState({ name: event.target.value })
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

  _handleChangeSelectAirline = async (event) => {
    let airline = await JSON.parse(event.target.value.toString())
    this.setState({
      airline_id: airline["id"],
      isLoadCountries: true
    })
    this.setState({
      countriesByAirline: Array.from(airline["countries"].split(',')),
      isLoadCountries: false
    })
  }

  _handleChangeSelectDestination(event) {
    this.setState({
      destination: event.target.value
    })
  }

  _handleChangeSelectDestinationCountry(event) {
    this.setState({
      destinationCountry: event.target.value,
      isLoadCitiesDestination: true
    })
    fetch('https://raw.githubusercontent.com/shivammathur/countrycity/master/data/geo.json',
      {
        method: 'GET'
      })
      .then(responseGeo => responseGeo.json())
      .then(responseGeoJson => {
        if (responseGeoJson !== '') {
          this.setState({
            listCitiesDestination: responseGeoJson[this.state.destinationCountry].sort(),
            isLoadCitiesDestination: false
          })
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  _handleChangeSelectOrigin(event) {
    this.setState({
      origin: event.target.value
    })
  }

  _handleChangeSelectOriginCountry(event) {
    this.setState({
      originCountry: event.target.value,
      isLoadCitiesOrigin: true
    })
    fetch('https://raw.githubusercontent.com/shivammathur/countrycity/master/data/geo.json',
      {
        method: 'GET'
      })
      .then(responseGeo => responseGeo.json())
      .then(responseGeoJson => {
        if (responseGeoJson !== '') {
          this.setState({
            listCitiesOrigin: responseGeoJson[this.state.originCountry].sort(),
            isLoadCitiesOrigin: false
          })
        }
      })
      .catch(error => {
        console.error(error);
      });
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

  _submitData = async () => {
    if (this.state.restrictions.length === 0 || this.state.services === 0) {
      window.confirm("Debe ingresar los campos restricciones y servicios.")
    }
    else if (this.state.id === '' || this.state.name === '') {
      window.confirm("Debe ingresar un nombre o código validos.")
    }
    else if (this.state.departure === '' || this.state.arrives === '' ||
      this.state.origin === '' || this.state.destination === '') {
      window.confirm("Debe ingresar origen, destino, salida y llegada validos.")
    }
    else if (this.state.airline_id === '' || this.state.state === '') {
      window.confirm("Debe indicar la aerolinea que opera el vuelo o el estado del vuelo correctos.")
    }
    else if (this.state.price === '' || this.state.capacityPlane === '') {
      window.confirm("Debe ingresar el precio o capacidad permitida con datos validos.")
    }
    else {
      let data = {
        _id: this.state.id,
        airline_id: this.state.airline_id,
        arrives: this.state.arrives,
        capacityPlane: this.state.capacityPlane,
        departure: this.state.departure,
        destination: this.state.destination,
        landing: this.state.landing,
        name: this.state.name,
        origin: this.state.origin,
        price: this.state.price,
        restrictions: this.state.restrictions,
        services: this.state.services,
        state: this.state.state,
        takeOff: this.state.takeOff,
        ticketsSold: 0
      }
      console.log(data);
      await fetch('http://localhost:3000/admin/newFlight/',
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson._id === this.state.id) {
            this.setState({
              airline_id: '',
              arrives: '',
              capacityPlane: '',
              departure: '',
              destination: '',
              id: '',
              landing: '',
              name: '',
              origin: '',
              price: '',
              restrictions: [],
              services: [],
              state: '',
              takeOff: ''
            })
            window.confirm(`Se agregado correctamente el nuevo vuelo.`)
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  render() {
    const spinnerCountries = this.state.isLoadCountries ? (
      <Spinner animation="grow" />
    ) : null;
    const spinnerCitiesDestination = this.state.isLoadCitiesDestination ? (
      <Spinner animation="grow" />
    ) : null;
    const spinnerCitiesOrigin = this.state.isLoadCitiesOrigin ? (
      <Spinner animation="grow" />
    ) : null;
    return (
      <Container>
        <Tabs defaultActiveKey="create" id="uncontrolled-tab-example">
          <Tab eventKey="create" title="C">
            <div style={{ margin: '2%' }}>
              <h3 align='center'>Agregar Vuelo</h3>
            </div>
            <Row className='justify-content-md-center'>
              <Col xs lg='2'></Col>
              <Col md='auto'>
                <Form>
                  <Form.Row style={{ marginTop: '4%' }}>
                    <Form.Group as={Col} controlId="ControlSelectOrigin" >
                      <Form.Label>Aerolinea</Form.Label>
                      <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectAirline.bind(this)}>
                        <option value={'DEFAULT'} disabled hidden>Seleccionar una aerolinea</option>
                        {this.state.listAirlines.map((item, index) => (
                          <option value={`{"id": "${item._id}", "countries": "${item.countries}"}`} key={index}>({item._id}) {item.name}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId='formGridId'>
                      <Form.Label>Codigo de vuelo</Form.Label>
                      <Form.Control type='string' placeholder='Código' value={this.state.id} onChange={this._handleChangeId.bind(this)} />
                    </Form.Group>
                    <Form.Group as={Col} controlId='formGridName'>
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control type='string' placeholder='Nombre' value={this.state.name} onChange={this._handleChangeName.bind(this)} />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ marginTop: '4%' }}>
                    <Form.Group as={Row}>Origen:</Form.Group>
                    <Form.Row style={{ marginTop: '2%' }}>
                      <Form.Group as={Col} controlId="ControlSelectOrigin">
                        <Form.Label>País{spinnerCountries}</Form.Label>
                        <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectOriginCountry.bind(this)}>
                          <option value={'DEFAULT'} disabled hidden>Seleccionar país de origen</option>
                          {this.state.countriesByAirline.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                          ))}
                        </Form.Control>
                        <Form.Label>Ciudad{spinnerCitiesOrigin}</Form.Label>
                        <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectOrigin.bind(this)}>
                          <option value={'DEFAULT'} disabled hidden>Seleccionar origen de vuelo</option>
                          {this.state.listCitiesOrigin.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Group as={Row}>Destino:</Form.Group>
                    <Form.Row style={{ marginTop: '2%' }}>
                      <Form.Group as={Col} controlId="ControlSelectDestination">
                        <Form.Label>País {spinnerCountries}</Form.Label>
                        <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectDestinationCountry.bind(this)}>
                          <option value={'DEFAULT'} disabled hidden>Seleccionar país de destino</option>
                          {this.state.countriesByAirline.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                          ))}
                        </Form.Control>
                        <Form.Label>Cuidad {spinnerCitiesDestination}</Form.Label>
                        <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectDestination.bind(this)}>
                          <option value={'DEFAULT'} disabled hidden>Seleccionar destino de vuelo</option>
                          {this.state.listCitiesDestination.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                  </Form.Row>

                  <Form.Row style={{ marginTop: '4%' }}>
                    <Form.Group as={Col} controlId="ControlSelectDeparture">
                      <Form.Label>Itinerario - Salida</Form.Label>
                      <Form.Control type="date" placeholder="salida" value={this.state.takeOff} onChange={this._handleChangeSelectTakeOff.bind(this)} />
                      <Form.Control type="time" placeholder="salida" value={this.state.departure} onChange={this._handleChangeDeparture.bind(this)} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="ControlSelectArrives">
                      <Form.Label>Itinerario - Llegada</Form.Label>
                      <Form.Control type="date" placeholder="llegada" value={this.state.landing} onChange={this._handleChangeSelectLanding.bind(this)} />
                      <Form.Control type="time" placeholder="llegada" value={this.state.arrives} onChange={this._handleChangeArrive.bind(this)} />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ marginTop: '4%' }}>
                    <Form.Group as={Col} controlId='formGridId'>
                      <Form.Label>Precio ($)</Form.Label>
                      <Form.Control type='string' placeholder='Precio de vuelo' value={this.state.price} onChange={this._handleChangePrice.bind(this)} />
                    </Form.Group>
                    <Form.Group as={Col} controlId='formGridName'>
                      <Form.Label>Capacidad máxima</Form.Label>
                      <Form.Control type='number' placeholder='Capacidad máxima de pasajeros' value={this.state.capacityPlane} onChange={this._handleChangeCapacityPlane.bind(this)} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="ControlSelectState">
                      <Form.Label>Estado</Form.Label>
                      <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectState.bind(this)}>
                        <option value={'DEFAULT'} disabled hidden>Seleccionar un estado de vuelo</option>
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
                      {this.state.restrictions.map((item, key) => (
                        <p style={{ margin: '2%' }} key={key}>{item}</p>
                      ))}
                    </Form.Group>
                    <Form.Group as={Col} controlId='formGridName'>
                      <Form.Label>Servicios</Form.Label>
                      <Form.Control type='string' placeholder='Servicios ofrecidos' value={this.state.service} onChange={this._handleChangeService.bind(this)} />
                      <Fab style={{ marginTop: '2%' }} variant="extended" aria-label="add" onClick={this._onClckAddServices}>
                        <AddIcon />
                        Agregar Servicio
                      </Fab>
                      {this.state.services.map((item, key) => (
                        <p style={{ margin: '2%' }} key={key}>{item}</p>
                      ))}
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
          </Tab>
          <Tab eventKey="read" title="R">
            <ReadFlight />
          </Tab>
          <Tab eventKey="update" title="U" >
            <UpdateFlight />
          </Tab>
          <Tab eventKey="delete" title="D" >
            <DeleteFlight />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}


export default Flight;
