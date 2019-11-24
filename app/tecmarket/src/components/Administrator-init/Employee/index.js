import React from 'react';
import { Button, Col, Container, Form, Row, Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleCrypto from 'simple-crypto-js';

/*Tabs*/
import DeleteEmployee from './Delete';
import ReadEmployee from './Read';
import UpdateEmployee from './Update';

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      area: '',
      firstName: '',
      id: '',
      initialDate: '',
      lastName: '',
      password: '',
      role: '',
      userName: ''
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

  _handleChangeInitialDate(event) {
    this.setState({ initialDate: event.target.value })
  }

  _handleChangeLastName(event) {
    this.setState({ lastName: event.target.value })
  }

  _handleChangePassword(event) {
    this.setState({ password: event.target.value })
  }

  _handleChangeUserName(event) {
    this.setState({ userName: event.target.value })
  }

  _handleChangeSelectRole(event) {
    this.setState({
      role: event.target.value
    })
  }

  _submitData = async () => {
    if (this.state.firstName === '' || this.state.lastName === '') {
      window.confirm("Debe ingresar un nombre o apellido validos.")
    }
    else if (this.state.username === '' || this.state.password === '') {
      window.confirm("Debe ingresar un nombre de usuario o contraseña validos.")
    }
    else if (this.state.role === '' || this.state.area === '') {
      window.confirm("Debe ingresar un rol o area validos.")
    }
    else if (this.state.initalDate === '' || this.state.id === '') {
      window.confirm("Debe ingresar un identificador o fecha de ingreso correctos.")
    }
    else {
      let simpleCrypto = new SimpleCrypto('vtecAPP');
      let passwordEncrypt = simpleCrypto.encrypt(this.state.password);
      let data = {
        _id: this.state.id,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        username: this.state.userName,
        password: passwordEncrypt,
        role: this.state.role,
        area: this.state.area,
        initalDate: this.state.initialDate
      }
      await fetch('http://localhost:3000/admin/newEmployee/',
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson._id === parseInt(this.state.id)) {
            this.setState({ id: '', firstName: '', lastName: '', userName: '', password: '', role: '', area: '', initialDate: '' })
            window.confirm(`Se agregado correctamente el usuario.`)
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
              <h3 align='center'>Agregar Empleado</h3>
            </div>
            <Row className='justify-content-md-center'>
              <Col xs lg='2'></Col>
              <Col md='auto'>
                <Form>
                  <Form.Row style={{ margin: '2%' }}>
                    <Form.Group as={Col} controlId='formGridName'>
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control type='string' placeholder='Nombre' value={this.state.firstName} onChange={this._handleChangeFirstName.bind(this)} />
                    </Form.Group>
                    <Form.Group as={Col} controlId='formGridLastName'>
                      <Form.Label>Apellidos</Form.Label>
                      <Form.Control type='string' placeholder='Apeliidos' value={this.state.lastName} onChange={this._handleChangeLastName.bind(this)} />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ margin: '2%' }}>
                    <Form.Group as={Col} controlId='formGridId'>
                      <Form.Label>Cédula</Form.Label>
                      <Form.Control type='number' placeholder='Numero de cédula' value={this.state.id} onChange={this._handleChangeId.bind(this)} />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ margin: '2%' }}>
                    <Form.Group as={Col} controlId='formGridUserName'>
                      <Form.Label>Nombre de usuario</Form.Label>
                      <Form.Control type='string' placeholder='Nombre usuario' value={this.state.userName} onChange={this._handleChangeUserName.bind(this)} />
                    </Form.Group>
                    <Form.Group as={Col} controlId='formGridPassword'>
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control type='password' placeholder='Contraseña' value={this.state.password} onChange={this._handleChangePassword.bind(this)} />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ margin: '2%' }}>
                    <Form.Group as={Col} controlId="ControlSelectRole">
                      <Form.Label>Tipo de funcionario</Form.Label>
                      <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectRole.bind(this)}>
                        <option value={'DEFAULT'} disabled hidden>Seleccionar un rol</option>
                        <option value={'administrator'} key={1}>Administrativo</option>
                        <option value={'technician'} key={2}>Técnico</option>
                        <option value={'operator'} key={3}>Operario</option>
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ margin: '2%' }}>
                    <Form.Group as={Col} controlId='formGridInitialDate'>
                      <Form.Label>Fecha de ingreso</Form.Label>
                      <Form.Control type="date" placeholder="dd/mm/yyyy" value={this.state.initialDate} onChange={this._handleChangeInitialDate.bind(this)} />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ margin: '2%' }}>
                    <Form.Group as={Col} controlId='formGridArea'>
                      <Form.Label>Área de trabajo</Form.Label>
                      <Form.Control type='string' placeholder='ingresar área de trabajo' value={this.state.area} onChange={this._handleChangeArea.bind(this)} />
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
            <ReadEmployee />
          </Tab>
          <Tab eventKey="update" title="U" >
            <UpdateEmployee />
          </Tab>
          <Tab eventKey="delete" title="D" >
            <DeleteEmployee />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}


export default Employee;
