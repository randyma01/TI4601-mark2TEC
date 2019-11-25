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
    await fetch('http://localhost:3000/admin/totalProfitFlights',
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
        <div style={{ margin: '5%' }}>
          <Table responsive>
            <thead>
              <tr>
                <th>Código Aerolinea</th>
                <th>Boletos Vendidos</th>
                <th>Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {this.state.result.map((item, index) => (
                <tr key={index}>
                  <td>{item._id.airline}</td>
                  <td>{item._id.ticketsSold}</td>
                  <td>${item._id.profit}</td>
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
