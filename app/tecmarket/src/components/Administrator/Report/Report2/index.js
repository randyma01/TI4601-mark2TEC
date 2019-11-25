import React from 'react';
import { Container, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Report extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      result: [],

    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    await fetch('http://localhost:3000/admin/topThreePassengers/', 
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            result: responseJson
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

  render() {
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h6 align='center'>Pasajeros con más vuelos</h6>
        </div>
        <div style={{ margin: '5%' }}>
          <Table responsive>
            <thead>
              <tr>
                <th>Identificación pasajero</th>
                <th>Vuelos adquiridos</th>
              </tr>
            </thead>
            <tbody>
              {this.state.result.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
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


export default Report;
