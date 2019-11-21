import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch
} from 'react-router-dom';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { I18nextProvider, withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
//componnets
import HomeComponent from './home';
import LanguageSelector from '../translation/languageSelector';
import Login from './session/login';
//administrator access
import AirlineComponent from '../components/Administrator/Airline';
import AirportComponent from '../components/Administrator/Airport';
import EmployeeComponent from '../components/Administrator/Employee';
import FlightComponent from '../components/Administrator/Flight';
import ReportComponent from '../components/Administrator/Report';
//operatos||technician access
import ProductsComponentEmployee from '../components/Employee/Product';
import SupermarketsComponentEmployee from '../components/Employee/Supermarket';
//passenger access
import AccountComponentPassenger from '../components/Passenger/Account';
import FlightComponentPassenger from '../components/Passenger/Flight';
import ReportComponentPassenger from '../components/Passenger/Report';
import TicketComponentPassenger from '../components/Passenger/Ticket';


class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: props.dataUser
    };
  }

  _optionUser = () => {
    const { t } = this.props;
    if (this.state.dataUser.role === 'administrator') {
      return (
        <Nav className="mr-auto">
          <Nav.Link as="span">{<Link to="/airports" style={{ color: '#FFF' }}>Aeropuertos</Link>}</Nav.Link>
          <Nav.Link as="span">{<Link to="/airlines" style={{ color: '#FFF' }}>Aerolineas</Link>}</Nav.Link>
          <Nav.Link as="span">{<Link to="/flights" style={{ color: '#FFF' }}>Vuelos</Link>}</Nav.Link>
          <Nav.Link as="span">{<Link to="/employees" style={{ color: '#FFF' }}>Empleados</Link>}</Nav.Link>
          <Nav.Link as="span">{<Link to="/reports" style={{ color: '#FFF' }}>Reportes</Link>}</Nav.Link>
        </Nav>
      )
    }
    else if (this.state.dataUser.role === 'employee') {
      return (
        <Nav className="mr-auto">
          <Nav.Link as="span">{<Link to="/employee/supermarkets" style={{ color: '#FFF' }}> {t('menu.labels.supermarkets')} </Link>}</Nav.Link>
          <Nav.Link as="span">{<Link to="/employee/products" style={{ color: '#FFF' }}> {t('menu.labels.products')} </Link>}</Nav.Link>
        </Nav >
      )
    }
    else {
      return (
        <Nav className="mr-auto">
          <Nav.Link as="span">{<Link to="/passenger/tickets" style={{ color: '#FFF' }}> {t('menu.labels.supermarkets')} </Link>}</Nav.Link>
          <Nav.Link as="span">{<Link to="/passenger/flights" style={{ color: '#FFF' }}> {t('menu.labels.products')} </Link>}</Nav.Link>
          <Nav.Link as="span">{<Link to="/passenger/reports" style={{ color: '#FFF' }}> {t('menu.labels.orders')} </Link>}</Nav.Link>
        </Nav >
      )
    }
  }

  render() {
    const { i18n } = this.props
    const { t } = this.props;
    const optionAccount = this.state.dataUser.role === 'customer' ? (
      <Nav.Link as="span">{<Link to="/passenger/account" style={{ color: 'rgba(255, 255, 255, .5)' }}> {t('menu.labels.account')} </Link>}</Nav.Link>
    ) : null;
    if (this.state.isSignup) {
      return (
        <Login />
      );
    }
    else {
      return (
        <Container style={{ marginTop: '2%' }}>
          <Router>
            <header>
              <Navbar expand="lg" variant="dark" style={{ backgroundColor: '#286178' }}>
                <Navbar.Brand>{<Link to="/" style={{ color: '#FFF' }}> {t('menu.labels.title')} </Link>}</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  {this._optionUser()}
                  <Nav>
                    {optionAccount}
                    <Button variant='link'
                      style={{ color: 'white' }} onClick={() => { this.setState({ isSignup: true }) }}> {t('menu.labels.logout')} </Button>
                  </Nav>

                </Navbar.Collapse>
              </Navbar>
              <Navbar fixed="bottom" expand="sm" variant="dark" style={{ backgroundColor: '#fff' }}>
                <Nav>
                  <I18nextProvider i18n={i18n}>
                    <LanguageSelector type={"up"} />
                  </I18nextProvider>
                </Nav>
              </Navbar>
            </header>
            <main>
              <Switch>
                <Route path='/' exact component={HomeComponent} />
                <Route path='/airports' exact component={() => <AirportComponent />} />
                <Route path='/airlines' exact component={() => <AirlineComponent />} />
                <Route path='/employees' exact component={() => <EmployeeComponent />} />
                <Route path='/flights' exact component={() => <FlightComponent />} />
                <Route path='/reports' exact component={() => <ReportComponent />} />
                <Route path='/employee/products' exact component={() => <ProductsComponentEmployee />} />
                <Route path='/employee/supermarkets' exact component={() => <I18nextProvider i18n={i18n}> <SupermarketsComponentEmployee /> </I18nextProvider>} />
                <Route path='/passenger/tickets' exact component={() => <TicketComponentPassenger dataUser={this.state.dataUser} />} />
                <Route path='/passenger/reports' exact component={() => <ReportComponentPassenger dataUser={this.state.dataUser} />} />
                <Route path='/passenger/flights' exact component={() => <FlightComponentPassenger dataUser={this.state.dataUser} />} />
                <Route path='/passenger/account' exact component={() => <AccountComponentPassenger dataUser={this.state.dataUser} />} />
                <Route path='/login' exact component={() => <Login />} />
              </Switch>
            </main>
          </Router>
        </Container>
      );
    }

  }
}

export default withTranslation()(Menu);
