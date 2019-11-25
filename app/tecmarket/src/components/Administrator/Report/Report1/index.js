import React from 'react';
import { Container, Col, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';

class Report extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      allFlights: [],
      allTickets: [],
      allTicketsTemp: [],
      endDateFlight: '',
      filtersDate: [],
      filtersState: [],
      flights: [],
      flightsTemp: [],
      passengerForTicker: [],
      passengerId: '',
      passengerTemp: [],
      startDateFlight: '',
      stateFlight: ''
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
    fetch('http://localhost:3000/employee/allTickets/',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            allTicketsTemp: responseJson
          });

        }
      })
      .catch(error => {
        console.error(error);
      });
    fetch('http://localhost:3000/admin/findAllFlights/',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            allFlights: responseJson,
            flightsTemp: responseJson
          });
          this.state.allTicketsTemp.forEach(async ticket => {
            await fetch(`http://localhost:3000/employee/passengerInfo/${ticket.passenger_id}`,
              {
                method: "GET"
              })
              .then(response => response.json())
              .then(passenger => {
                if (passenger !== '') {
                  ticket["passenger"] = passenger[0];
                  this.setState({
                    allTickets: [...this.state.allTickets, ticket]
                  })
                }
              })
              .catch(error => {
                console.error(error);
              });
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

  _handleChangeEndDate(event) {
    let endDateFilter = event.target.value;
    let filterFlights = this.state.stateFlight === '' || this.state.endDateFlight
      ?
      this.state.flightsTemp.filter(item => item.takeOff >= this.state.startDateFlight && item.landing <= endDateFilter)
      :
      this.state.filtersState.filter(item => item.takeOff >= this.state.startDateFlight && item.landing <= endDateFilter);

    this.setState({
      endDateFlight: endDateFilter,
      allFlights: filterFlights,
      filtersDate: filterFlights
    })
  }

  _handleChangePassenger(event) {
    this.setState({ passengerId: event.target.value });

  }

  _handleChangePassengerFilter = () => {
    let filterTickets = this.state.allTickets.filter(ticket => parseInt(ticket.passenger["_id"]) === parseInt(this.state.passengerId));
    let filterFlights = [];
    console.log(filterTickets);
    this.state.allFlights.forEach(flight => {
      filterTickets.forEach(ticket => {
        if (flight._id === ticket.flight_id && !filterFlights.includes(flight)) {
          filterFlights.push(flight)
        }
      });
    });
    this.setState({
      allFlights: filterFlights
    })

  }

  _handleChangeSelectState(event) {
    let stateFilter = event.target.value;
    let filterFlights = this.state.endDateFlight === '' ? this.state.flightsTemp.filter(item => item.state === stateFilter) : this.state.filtersDate.filter(item => item.state === stateFilter);
    this.setState({
      stateFlight: stateFilter,
      allFlights: filterFlights,
      filtersState: filterFlights
    })
  }

  _handleChangeStartDate(event) {
    this.setState({ startDateFlight: event.target.value });
  }

  _onClickRefresTickets = async () => {
    this.setState({
      allFlights: this.state.flightsTemp,
      stateFlight: '', startDateFlight: '', endDateFlight: '',
    })
  }

  _sumAmountTicket = (flightId) => {
    let totalAmountTicket = 0
    this.state.allTickets.forEach(ticket => {
      if (flightId === ticket.flight_id) {
        totalAmountTicket += ticket.amount
      }
    });
    return (<p>{totalAmountTicket}</p>)
  }


  render() {
    return (
      <Container>
        <div style={{ marginTop: '2%' }}>
          <Form>
            <Form.Row style={{ marginTop: '4%' }}>
              <Form.Group as={Col} controlId="ControlSelectOrigin" >
                <Form.Label>Identificación
              </Form.Label>
                <IconButton aria-label="searchName" onClick={this._handleChangePassengerFilter}>
                  <FindReplaceIcon />
                </IconButton>
                <Form.Control type='string' placeholder='Identidicación de pasajero' onChange={this._handleChangePassenger.bind(this)}>

                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="ControlSelectState" >
                <Form.Label>Estado</Form.Label>
                <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectState.bind(this)}>
                  <option value={'DEFAULT'} disabled hidden>Seleccionar un estado de vuelo</option>
                  <option value={'A tiempo'}>A Tiempo</option>
                  <option value={'Retrasado'}>Retrasado</option>
                  <option value={'Cancelado'}>Cancelado</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="ControlInputStartDate">
                <Form.Label>Desde</Form.Label>
                <Form.Control type="date" placeholder="dd/mm/yyyy" onChange={this._handleChangeStartDate.bind(this)} />
              </Form.Group>
              <Form.Group as={Col} controlId="ControlInputEndDate">
                <Form.Label>Hasta</Form.Label>
                <Form.Control type="date" placeholder="dd/mm/yyyy" onChange={this._handleChangeEndDate.bind(this)} />
              </Form.Group>
            </Form.Row>
          </Form>
        </div>
        <div style={{ marginTop: '5%' }}>
          <IconButton aria-label="refresh" onClick={this._onClickRefresTickets}>
            <Refresh />
          </IconButton>
          <Table striped bordered hover responsive >
            <thead>
              <tr>
                <th>Cantidad Operaciones</th>
                <th>Identificador Vuelo</th>
                <th>Nombre</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Estado</th>
                <th>Código de Aerolinea</th>
                <th>Boletos</th>
              </tr>
            </thead>
            <tbody>
              {this.state.allFlights.map((flight, indexF) => (
                <tr key={indexF}>
                  <td>
                    {this._sumAmountTicket(flight._id)}
                  </td>
                  <td>{flight._id}</td>
                  <td>{flight.name}</td>
                  <td>{flight.origin}</td>
                  <td>{flight.destination}</td>
                  <td>{flight.state}</td>
                  <td>{flight.airline_id}</td>
                  <td>
                    {this.state.allTickets.map((ticket, index) => (
                      flight._id === ticket.flight_id ? (
                        <p key={index}>Código: {ticket._id} | Pasajero: {ticket.passenger["firstName"]} - {ticket.passenger["_id"]}  | Cantidad: {ticket.amount}.</p>
                      ) : null
                    ))}
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


export default Report;
