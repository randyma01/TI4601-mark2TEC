import React from 'react';
import { Button, Col, Container, Form, Row, Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

/*Tabs*/
import DeleteAirline from './Delete';
import ReadAirline from './Read';
import UpdateAirline from './Update';

class Airline extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      airport: '',
      code: '',
      countries: [],
      country: '',
      listAirports: [],
      listCountries: [],
      name: ''
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
    await fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json',
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

    await fetch('http://localhost:3000/admin/findAllAirports/',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            listAirports: responseJson
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

  _handleChangeSelectAirport(event) {
    this.setState({ airport: event.target.value })
  }

  _handleChangeSelectCountry = async (event) => {
    this.setState({
      country: event.target.value
    })
  }

  _onClckAddCountries = () => {
    if (this.state.country !== '') {
      this.setState({
        countries: [...this.state.countries, this.state.country],
        country: ''
      })
    }
  }

  _submitData = async () => {
    if (this.state.name === '') {
      window.confirm("Debe Ingresar un nombre de aerolinea.")
    }
    else if (this.state.airport === '') {
      window.confirm("Debe indicar el aeropuerto de operación.")
    }
    else if (this.state.countries.length === 0) {
      window.confirm("Debe ingresar al menos un pais donde realizará vuelos.")
    }
    else {
      let data = {
        _id: this.state.code,
        name: this.state.name,
        countries: this.state.countries,
        airport_id: this.state.airport
      }
      await fetch('http://localhost:3000/admin/newAirline/',
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
            this.setState({ name: '', countries: [], airport: '', code: '' })
            window.confirm("Se agregado correctamente la nueva aerolinea.")
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
        <Tabs defaultActiveKey="create" id="uncontrolled-tab-example">
          <Tab eventKey="create" title="C">
            <div style={{ margin: '2%' }}>
              <h3 align='center'>Agregar Aerolinea</h3>
            </div>
            <Row className='justify-content-md-center'>
              <Col xs lg='2'></Col>
              <Col md='auto'>
                <Form>
                  <Form.Row style={{ marginTop: '2%' }}>
                    <Form.Group as={Col} controlId='formGridName'>
                      <Form.Label>Código</Form.Label>
                      <Form.Control type='string' placeholder='Código de aerolinea' value={this.state.code} onChange={this._handleChangeCode.bind(this)} />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ marginTop: '2%' }}>
                    <Form.Group as={Col} controlId='formGridName'>
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control type='string' placeholder='Nombre' value={this.state.name} onChange={this._handleChangeName.bind(this)} />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ marginTop: '2%' }}>
                    <Form.Group as={Col} controlId="ControlSelectAirport">
                      <Form.Label>Aeropuerto de operación</Form.Label>
                      <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectAirport.bind(this)}>
                        <option value={'DEFAULT'} disabled hidden>Seleccionar un aeropuerto</option>
                        {this.state.listAirports.map((item, index) => (
                          <option value={item._id} key={index}>({item._id}) {item.name}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row style={{ marginTop: '2%' }}>
                    <Form.Group as={Col} controlId="ControlSelectCountries">
                      <Form.Label>Paises</Form.Label>
                      <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectCountry.bind(this)}>
                        <option value={'DEFAULT'} disabled hidden>Seleccionar los paises de operación</option>
                        {this.state.listCountries.map((item, key) => (
                          <option value={item.name} key={key}>{item.name}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId='formGridAddCountry'>
                      <Fab variant="extended" aria-label="add" onClick={this._onClckAddCountries}>
                        <AddIcon />
                        Agregar País
                  </Fab>
                    </Form.Group>
                  </Form.Row>
                  <div>
                    <p>Lista de paises a realizar vuelos:</p>
                    {this.state.countries.map((item, key) => (
                      <p style={{ margin: '2%' }} key={key}>{item}</p>
                    ))}
                  </div>
                </Form>
              </Col>
              <Col xs lg='2'></Col>
            </Row>

            <Row className='justify-content-md-center' style={{ margin: '3%' }}>
              <Button
                variant='primary'
                size='lg'
                onClick={this._submitData}
              >
                Confirmar
              </Button>
            </Row>
          </Tab>
          <Tab eventKey="read" title="R">
            <ReadAirline />
          </Tab>
          <Tab eventKey="update" title="U" >
            <UpdateAirline />
          </Tab>
          <Tab eventKey="delete" title="D" >
            <DeleteAirline />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}


export default Airline;
