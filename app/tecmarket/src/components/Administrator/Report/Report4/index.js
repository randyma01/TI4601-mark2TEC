import React from 'react';
import { Button, Container, Col, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Report1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      passengerId: ''
    };
  }

  _handleChangePassenger(event) {
    this.setState({ passengerId: event.target.value });
  }

  _submitData = async () => {
    if (this.state.passengerId !== '') {
      await fetch(`http://localhost:3000/admin/rangeTicketsPassengers/${this.state.passengerId}`,
        {
          method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson !== '') {
            this.setState({
              result: responseJson
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      window.confirm("Debe ingresar indentifiación del pasajero.")
    }
  }

  render() {
    return (
      <Container>
        <Form>
          <Form.Row style={{ marginTop: '4%' }}>
            <Form.Group as={Col} controlId="ControlSelectPassengerId" >
              <Form.Label>Numero de cedula</Form.Label>
              <Form.Control type='number' placeholder='Cedula de pasajero' value={this.state.passengerId} onChange={this._handleChangePassenger.bind(this)} />
            </Form.Group>
            <Form.Group as={Col} controlId='formGridButtonSearchPassenger'>
              <Button
                variant='primary'
                size='lg'
                onClick={this._submitData}>
                Buscar
                </Button>
            </Form.Group>
          </Form.Row>
        </Form>
        <div style={{ margin: '5%' }}>
          <Table responsive>
            <thead>
              <tr>
                <th>Identificación</th>
                <th>Minimo</th>
                <th>Maximo</th>
              </tr>
            </thead>
            <tbody>
              {this.state.result.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
                  <td>{item.minQuantity}</td>
                  <td>{item.maxQuantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    );
  }
}


export default Report1;
