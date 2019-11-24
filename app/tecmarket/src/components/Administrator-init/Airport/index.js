import React from 'react';
import { Button, Col, Container, Form, Row, Spinner, Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/*Tabs*/
import DeleteAirport from './Delete';
import ReadAirport from './Read';
import UpdateAirport from './Update';

class Airport extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      code: '',
      country: '',
      countryCode: '',
      listCities: [],
      listCountries: [],
      name: '',
      number: '',
      webPage: ''
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    const countries = await fetch('https://raw.githubusercontent.com/shivammathur/countrycity/master/data/geo.json',
      {
        method: 'GET'
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          return Object.keys(responseJson).sort()
        }
      })
      .catch(error => {
        console.error(error);
      });
    fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          const tempCountries = []
          responseJson.forEach(element => {
            if (countries.includes(element.name)) {
              tempCountries.push(element);
            }
          })
          this.setState({
            listCountries: tempCountries
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

  _handleChangeCode(event) {
    this.setState({ code: event.target.value })
  }

  _handleChangeName(event) {
    this.setState({ name: event.target.value })
  }

  _handleChangeNumber(event) {
    this.setState({ number: event.target.value })
  }

  _handleChangeWebPage(event) {
    this.setState({ webPage: event.target.value })
  }

  _handleChangeSelectCity(event) {
    this.setState({ city: event.target.value })
  }

  _handleChangeSelectCountry = async (event) => {
    const item = await JSON.parse(event.target.value.toString())
    this.setState({
      country: item["country"],
      countryCode: item["code"],
      isLoadCities: true
    })

    fetch('https://raw.githubusercontent.com/shivammathur/countrycity/master/data/geo.json',
      {
        method: 'GET'
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          this.setState({
            listCities: responseJson[this.state.country].sort(),
            isLoadCities: false
          })
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  _submitData = async () => {
    if (this.state.name === '' || this.state.code === '') {
      window.confirm("Debe Ingresar un nombre y código para el aeropuerto.")
    }
    else if (this.state.country === '' || this.state.city === '') {
      window.confirm("Debe ingresar un país y ciuidad.")
    }
    else if (this.state.number === '' || this.state.webPage === '') {
      window.confirm("Debe ingresar un numero y sito web validos.")
    }
    else {
      let data = {
        _id: this.state.code,
        name: this.state.name,
        city: this.state.city,
        country: this.state.country,
        number: `(+${this.state.countryCode}) ${this.state.number}`,
        webPage: this.state.webPage
      }
      await fetch('http://localhost:3000/admin/newAirport/',
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.name === this.state.name) {
            this.setState({ name: '', city: '', country: '', number: '', webPage: '', code: '' })
            window.confirm("Se agregado correctamente el nuevo aeropuerto.")
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  render() {
    const spinnerCities = this.state.isLoadCities ?
      (
        <Spinner animation="grow" />
      ) : null;
    return (
      <Container>
        <Tabs defaultActiveKey="create" id="uncontrolled-tab-example">
          <Tab eventKey="create" title="C">
            <div style={{ margin: '2%' }}>
              <h3 align='center'>Agregar Aeropuerto</h3>
            </div>
            <Row className='justify-content-md-center'>
              <Col xs lg='2'></Col>
              <Col md='auto'>
                <Form>
                  <Form.Row style={{ marginTop: '2%' }}>
                    <Form.Group as={Col} controlId='formGridName'>
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control type='string' placeholder='Nombre' value={this.state.name} onChange={this._handleChangeName.bind(this)} />
                    </Form.Group>

                    <Form.Group as={Col} controlId='formGridLastname'>
                      <Form.Label>Código</Form.Label>
                      <Form.Control type='string' placeholder='Código' value={this.state.code} onChange={this._handleChangeCode.bind(this)} />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ marginTop: '2%' }}>
                    <Form.Group as={Col} controlId="ControlSelectCountry">
                      <Form.Label>País</Form.Label>
                      <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectCountry.bind(this)}>
                        <option value={'DEFAULT'} disabled hidden>Seleccionar un país</option>
                        {this.state.listCountries.map((item, index) => (
                          <option value={'{"country":"' + item.name + '", "code":"' + item.phone_code + '"}'} key={index}>{item.name}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="ControlSelectCity">
                      <Form.Label>Ciudad {spinnerCities}</Form.Label>
                      <Form.Control as="select" defaultValue={'DEFAULT'} value={this.state.address} onChange={this._handleChangeSelectCity.bind(this)}>
                        <option value={'DEFAULT'} disabled hidden>Seleccionar una ciudad</option>
                        {this.state.listCities.map((item, key) => (
                          <option key={key}>{item}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ marginTop: '2%' }}>
                    <Form.Group as={Col} controlId='formGridNumber'>
                      <Form.Label>Número de Telefóno (+{this.state.countryCode})</Form.Label>
                      <Form.Control type='number' placeholder='Numero telefonico' value={this.state.number} onChange={this._handleChangeNumber.bind(this)} />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ marginTop: '2%' }}>
                    <Form.Group as={Col} controlId='formGrid'>
                      <Form.Label>URL de sitio web</Form.Label>
                      <Form.Control type='string' placeholder='https://www.airport.com' value={this.state.webPage} onChange={this._handleChangeWebPage.bind(this)} />
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
            <ReadAirport />
          </Tab>
          <Tab eventKey="update" title="U" >
            <UpdateAirport />
          </Tab>
          <Tab eventKey="delete" title="D" >
            <DeleteAirport />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}


export default Airport;
