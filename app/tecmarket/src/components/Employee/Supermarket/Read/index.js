import React from 'react';
import { Container, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';

class Supermarket extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      listAirlines: []
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;

    /*
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
      */
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _onClickRefreshAirlines = async () => {
    //TODO
  }

  render() {  //style={{ color: 'red' }} 
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h3 align='center'>Ver Aerolineas</h3>
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
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    );
  }
}


export default Supermarket;
