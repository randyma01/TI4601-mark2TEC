import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleCrypto from 'simple-crypto-js';

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      area: '',
      employee: [],
      firstName: '',
      id: '',
      lastName: '',
      password: '',
      role: '',
    };
  }

  _handleChangeArea(event) {
    this.setState({ area: event.target.value })
  }

  _handleChangeFirstName(event) {
    this.setState({ firstName: event.target.value })
  }

  _handleChangeId(event) {
    this.setState({ id: event.target.value })
  }

  _handleChangeLastName(event) {
    this.setState({ lastName: event.target.value })
  }

  _handleChangePassword(event) {
    this.setState({ password: event.target.value })
  }

  _handleChangeSelectRole(event) {
    this.setState({
      role: event.target.value
    })
  }


  _onClickSearchEmployee = async () => {
    if (this.state.id === '') {
      window.confirm("Debe ingresar identificador de empleado para modificar.")
    } else {
      await fetch(`http://localhost:3000/admin/findEmployeesId/${this.state.id}`,
        {
          method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson !== '') {
            this.setState({
              employee: responseJson,
              id: ''
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  _submitData = async () => {
    if (this.state.firstName === '' || this.state.lastName === '') {
      window.confirm("Debe ingresar un nombre o apellido validos.")
    }
    else if (this.state.password === '') {
      window.confirm("Debe ingresar una contraseña valida.")
    }
    else if (this.state.role === '' || this.state.area === '') {
      window.confirm("Debe ingresar un rol o area validos.")
    }
    else {
      let simpleCrypto = new SimpleCrypto('vtecAPP');
      let passwordEncrypt = simpleCrypto.encrypt(this.state.password);
      let data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        password: passwordEncrypt,
        role: this.state.role,
        area: this.state.area
      }
      await fetch(`http://localhost:3000/admin/updateEmployee/${this.state.employee._id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.firstName === this.state.firstName) {
            this.setState({ firstName: '', employee: [], lastName: '', password: '', role: '', area: '' })
            window.confirm("Se actualizado correctamente el empleado.")
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
          <h3 align='center'>Actualizar Empleado</h3>
        </div>
        <Row className='justify-content-md-center'>
          <Col xs lg='2'></Col>
          <Col md='auto'>
            <Form>
              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Col} controlId='formGridIdSearch'>
                  <Form.Label>Identificación</Form.Label>
                  <Form.Control type='string' placeholder='Identificación de empleado modificar' value={this.state.id} onChange={this._handleChangeId.bind(this)} />
                </Form.Group>
                <Form.Group as={Col} controlId='formGridButton'>
                  <Button onClick={this._onClickSearchEmployee}>Buscar</Button>
                </Form.Group>
              </Form.Row>
            </Form>
            <Form>
              <Form.Row style={{ margin: '2%' }}>
                <Form.Group as={Col} controlId='formGridNameEdit'>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type='string' placeholder={this.state.employee.firstName} value={this.state.firstName} onChange={this._handleChangeFirstName.bind(this)} />
                </Form.Group>
                <Form.Group as={Col} controlId='formGridLastNameEdit'>
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control type='string' placeholder={this.state.employee.lastName} value={this.state.lastName} onChange={this._handleChangeLastName.bind(this)} />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ margin: '2%' }}>
                <Form.Group as={Col} controlId='formGridIdEdit'>
                  <Form.Label>Cédula</Form.Label>
                  <Form.Control type='number' placeholder={this.state.employee._id} disabled />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ margin: '2%' }}>
                <Form.Group as={Col} controlId='formGridUserNameEdit'>
                  <Form.Label>Nombre de usuario</Form.Label>
                  <Form.Control type='string' placeholder={this.state.employee.username} disabled />
                </Form.Group>
                <Form.Group as={Col} controlId='formGridPasswordEdit'>
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type='password' placeholder='Contraseña' value={this.state.password} onChange={this._handleChangePassword.bind(this)} />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ margin: '2%' }}>
                <Form.Group as={Col} controlId="ControlSelectRoleEdit">
                  <Form.Label>Tipo de funcionario</Form.Label>
                  <Form.Control as="select" defaultValue={this.state.employee.role} onChange={this._handleChangeSelectRole.bind(this)}>
                    <option value={'administrator'} key={1}>Administrativo</option>
                    <option value={'technician'} key={2}>Técnico</option>
                    <option value={'operator'} key={3}>Operario</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ margin: '2%' }}>
                <Form.Group as={Col} controlId='formGridInitialDateEdit'>
                  <Form.Label>Fecha de ingreso</Form.Label>
                  <Form.Control type="string" placeholder={this.state.employee.initalDate} disabled />
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ margin: '2%' }}>
                <Form.Group as={Col} controlId='formGridAreaEdit'>
                  <Form.Label>Área de trabajo</Form.Label>
                  <Form.Control type='string' placeholder={this.state.employee.area} value={this.state.area} onChange={this._handleChangeArea.bind(this)} />
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


export default Employee;
