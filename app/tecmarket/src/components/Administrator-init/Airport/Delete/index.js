import React from 'react';
import { Container, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';

class Airport extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      listAirports: []
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
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

  _onClickDeleteAirport(id) {
    const verify = window.confirm("Confirmar para borrar el aeropuerto seleccionado.")
    console.log(verify)
    if (verify) {
      fetch(`http://localhost:3000/admin/deleteAirports/${id}`,
        {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson._id === id) {
            window.confirm("Aeropuerto borrada exisotamente, actualizar vista.")
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  _onClickRefreshAirports = async () => {
    await fetch('http://localhost:3000/admin/findAllAirports/',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          this.setState({
            listAirports: responseJson
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
          <h3 align='center'>Borrar Aeropuerto</h3>
        </div>

        <div style={{ margin: '5%' }}>
          <IconButton aria-label="refresh" onClick={this._onClickRefreshAirports}>
            <Refresh />
          </IconButton>
          <Table responsive>
            <thead>
              <tr>
                <th>Identificador</th>
                <th>Nombre</th>
                <th>País</th>
                <th>Ciudad</th>
                <th>Teléfono</th>
                <th>Sitio Web</th>
              </tr>
            </thead>
            <tbody>
              {this.state.listAirports.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.country}</td>
                  <td>{item.city}</td>
                  <td>{item.number}</td>
                  <td>{item.webPage}</td>
                  <td>
                    <IconButton aria-label="delete" style={{ color: 'red' }} onClick={this._onClickDeleteAirport.bind(this, item._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    );
  }
}


export default Airport;
