import React from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';

class Airline extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      airline: [],
      code: '',
      countries: [],
      country: '',
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
        if (responseJson !== ''&& this._isMounted) {
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

  _onClickDeleteCountry(country) {
    this.setState(state => {
      const tempCountries = state.countries.filter(item => item !== country);
      state.countries = tempCountries;
      return {
        tempCountries
      };
    });
  }

  _onClickSearchAirline = async () => {
    if (this.state.code === '') {
      window.confirm("Debe ingresar un código de aerolinea para modificar.")
    } else {
      await fetch(`http://localhost:3000/admin/findAirlinesId/${this.state.code}`,
        {
          method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson !== '') {
            this.setState({
              airline: responseJson,
              countries: responseJson.countries,
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
    if (this.state.name === '') {
      window.confirm("Debe Ingresar un nombre de aerolinea.")
    }
    else if (this.state.countries.length === 0) {
      window.confirm("Debe ingresar al menos un pais donde realizará vuelos.")
    }
    else {
      let data = {
        name: this.state.name,
        countries: this.state.countries
      }
      await fetch(`http://localhost:3000/admin/updateAirlines/${this.state.code}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.name === this.state.name) {
            this.setState({ name: '', countries: [], airport: '', code: '' })
            window.confirm("Se actualizado correctamente la aerolinea.")
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
          <h3 align='center'>Actualizar Aerolinea</h3>
        </div>
        <Row className='justify-content-md-center'>
          <Col xs lg='2'></Col>
          <Col md='auto'>
            <Form>
              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Col} controlId='formGridCodeSearch'>
                  <Form.Label>Código</Form.Label>
                  <Form.Control type='string' placeholder='Código de aerolinea modificar' value={this.state.code} onChange={this._handleChangeCode.bind(this)} />
                </Form.Group>
                <Form.Group as={Col} controlId='formGridButton'>
                  <Button onClick={this._onClickSearchAirline}>Buscar</Button>
                </Form.Group>
              </Form.Row>
            </Form>
            <Form>
              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Col} controlId='formGridCode'>
                  <Form.Label>Código</Form.Label>
                  <Form.Control type='string' placeholder={this.state.airline._id} disabled />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Col} controlId='formGridName'>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type='string' placeholder={this.state.airline.name} value={this.state.name} onChange={this._handleChangeName.bind(this)} />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Col} controlId="ControlSelectAirport">
                  <Form.Label>Aeropuerto de operación</Form.Label>
                  <Form.Control type='string' placeholder={this.state.airline.airport_id} disabled />
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
              <div style={{ overflow: 'auto', height: '200px' }}>
                <Table striped bordered hover responsive >
                  <thead>
                    <tr>
                      <th>País</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.countries.map((item, index) => (
                      <tr key={index}>
                        <td>{item}</td>
                        <td>
                          <IconButton aria-label="delete" style={{ color: 'red' }} onClick={this._onClickDeleteCountry.bind(this, item)}>
                            <DeleteIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
      </Container>
    );
  }
}


export default Airline;
