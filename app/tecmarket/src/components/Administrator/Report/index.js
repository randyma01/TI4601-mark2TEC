import React from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Report1 from './Profit-flights';
import Report2 from './Tickets-passenger';
import Report3 from './Visited-destinations';
import Report4 from './Amount-ticket';
import Report5 from './Passenger-tickets-purchased';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: '',
    };
  }

  render() {
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h5 align='center'>Reportes Administrativos</h5>
        </div>
        <Tabs defaultActiveKey="report1" id="uncontrolled-tab-example">
          <Tab eventKey="report1" title="Ganancia Total de Vuelos">
            <Report1 />
          </Tab>
          <Tab eventKey="report2" title="Boletos Comprados por Pasajero">
            <Report2 />
          </Tab>
          <Tab eventKey="report3" title="Destinos más Visitados" >
            <Report3 />
          </Tab>
          <Tab eventKey="report4" title="Boletos Registrados en el Sistema" >
            <Report4 />
          </Tab>
          <Tab eventKey="report5" title="Top 3 Pasajeros" >
            <Report5 />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}


export default Report;
