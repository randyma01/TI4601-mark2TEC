import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Airport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      airport: [],
      code: '',
      countryCode: '',
      name: '',
      number: '',
      webPage: ''
    };
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


  _onClickSearchAirport = async () => {
    if (this.state.code === '') {
      window.confirm("Debe ingresar un código de aeropuerto para modificar.")
    } else {
      await fetch(`http://localhost:3000/admin/findAirportsId/${this.state.code}`,
        {
          method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson !== '') {
            this.setState({
              airport: responseJson,
              code: ''
            });
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
          if (responseJson !== '') {
            responseJson.map((item) => {
              if (item.name === this.state.airport.country) {
                return this.setState({
                  countryCode: item.phone_code
                });
              } else {
                return ''
              }
            })
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  _submitData = async () => {
    if (this.state.name === '') {
      window.confirm("Debe ingresar un nombre aeropuerto.")
    }
    else if (this.state.number === '' || this.state.webPage === '') {
      window.confirm("Debe ingresar un numero o sito web validos.")
    }
    else {
      let data = {
        name: this.state.name,
        number: `(+${this.state.countryCode}) ${this.state.number}`,
        webPage: this.state.webPage
      }
      await fetch(`http://localhost:3000/admin/updateAirport/${this.state.airport._id}`,
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
            this.setState({ name: '', airport: [], number: '', webPage: '', countryCode: '' })
            window.confirm("Se actualizado correctamente el aeropuerto.")
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
          <h3 align='center'>Actualizar Aeropuerto</h3>
        </div>
        <Row className='justify-content-md-center'>
          <Col xs lg='2'></Col>
          <Col md='auto'>
            <Form>
              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Col} controlId='formGridCodeSearchAirport'>
                  <Form.Label>Código</Form.Label>
                  <Form.Control type='string' placeholder='Código de aeropuerto modificar' value={this.state.code} onChange={this._handleChangeCode.bind(this)} />
                </Form.Group>
                <Form.Group as={Col} controlId='formGridButton'>
                  <Button onClick={this._onClickSearchAirport}>Buscar</Button>
                </Form.Group>
              </Form.Row>
            </Form>
            <Form>
              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Col} controlId='formGridName'>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type='string' placeholder={this.state.airport.name} value={this.state.name} onChange={this._handleChangeName.bind(this)} />
                </Form.Group>

                <Form.Group as={Col} controlId='formGridLastname'>
                  <Form.Label>Código</Form.Label>
                  <Form.Control type='string' placeholder={this.state.airport._id} disabled />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Col} controlId="ControlSelectCountry">
                  <Form.Label>País</Form.Label>
                  <Form.Control type='string' placeholder={this.state.airport.country} disabled />
                </Form.Group>

                <Form.Group as={Col} controlId="ControlSelectCity">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control type='string' placeholder={this.state.airport.city} disabled />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Col} controlId='formGridNumber'>
                  <Form.Label>Número de Telefóno (+{this.state.countryCode})</Form.Label>
                  <Form.Control type='number' placeholder={this.state.airport.number} value={this.state.number} onChange={this._handleChangeNumber.bind(this)} />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Col} controlId='formGrid'>
                  <Form.Label>URL de sitio web</Form.Label>
                  <Form.Control type='string' placeholder={this.state.airport.webPage} value={this.state.webPage} onChange={this._handleChangeWebPage.bind(this)} />
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


export default Airport;
