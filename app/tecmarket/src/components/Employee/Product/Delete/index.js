import React from 'react';
import { Container, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';

class Airline extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      listAirlines: []
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;

    await fetch('http://localhost:3000/admin/findAllAirlines/',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            listAirlines: responseJson
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

  _onClickDeleteAirline(id) {
    const verify = window.confirm("Confirmar para borrar la aerolinea seleccionada.")
    console.log(verify)
    if (verify) {
      fetch(`http://localhost:3000/admin/deleteAirline/${id}`,
        {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson._id === id) {
            window.confirm("Aerolinea borrada exisotamente, actualizar vista.")
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  _onClickRefreshAirlines = async () => {
    await fetch('http://localhost:3000/admin/findAllAirlines/',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          this.setState({
            listAirlines: responseJson
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
          <h3 align='center'>Borrar Aerolinea</h3>
        </div>

        <div style={{ margin: '5%' }}>
          <IconButton aria-label="refresh" onClick={this._onClickRefreshAirlines}>
            <Refresh />
          </IconButton>
          <Table responsive>
            <thead>
              <tr>
                <th>Identificador</th>
                <th>Nombre</th>
                <th>Aeropuerto de operación</th>
                <th>Países</th>
              </tr>
            </thead>
            <tbody>
              {this.state.listAirlines.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.airport_id}</td>
                  <td>{JSON.stringify(item.countries)}</td>
                  <td>
                    <IconButton aria-label="delete" style={{ color: 'red' }} onClick={this._onClickDeleteAirline.bind(this, item._id)}>
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


export default Airline;
