import React from 'react';
import { Container, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';

class Employee extends React.Component {
  _isMounted = false
  constructor(props) {
    super(props);
    this.state = {
      listEmployees: []
    };
  }

  componentDidMount = async () => {
    this._isMounted = true
    await fetch('http://localhost:3000/admin/findAllEmployees/',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            listEmployees: responseJson
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

  _onClickDeleteEmployee(id) {
    const verify = window.confirm("Confirmar para borrar el usuario seleccionado.")
    console.log(verify)
    if (verify) {
      fetch(`http://localhost:3000/admin/deleteEmployee/${id}`,
        {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson._id === id) {
            window.confirm("Empleado borrado exisotamente, actualizar vista.")
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  _onClickRefreshEmployees = async () => {
    await fetch('http://localhost:3000/admin/findAllEmployees/',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          this.setState({
            listEmployees: responseJson
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h3 align='center'>Borrar Empleados</h3>
        </div>

        <div style={{ margin: '5%' }}>
          <IconButton aria-label="refresh" onClick={this._onClickRefreshEmployees}>
            <Refresh />
          </IconButton>
          <Table responsive>
            <thead>
              <tr>
                <th>Identificador</th>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Fecha de ingreso</th>
              </tr>
            </thead>
            <tbody>
              {this.state.listEmployees.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
                  <td>{item.firstName} {item.lastName}</td>
                  <td>{item.username}</td>
                  <td>{item.role}</td>
                  <td>{item.initalDate}</td>
                  <td>
                    <IconButton aria-label="delete" style={{ color: 'red' }} onClick={this._onClickDeleteEmployee.bind(this, item._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container >
    );
  }
}


export default Employee;
