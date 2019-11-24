import React from 'react';
import { Container, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';

class Employee  extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      listEmployees: []
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    await fetch('http://localhost:3000/admin/findAllEmployees/',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounte) {
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
          <h3 align='center'>Ver Empleados</h3>
        </div>
        <div style={{ margin: '5%', height: '560px', overflowY: 'auto'}}>
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
                  <td>{item.username  }</td>
                  <td>{item.role}</td>
                  <td>{item.initalDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    );
  }
}


export default Employee;
