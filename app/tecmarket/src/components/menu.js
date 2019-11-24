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
//Customer access
import AccountComponentCustomer from '../components/Customer/Account';
import OrderComponentCustomer from '../components/Customer/Order';
import ProductComponentCustomer from '../components/Customer/Product';
import SupermarketComponentCustomer from '../components/Customer/Supermarket';


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
          <Nav.Link as="span">{<Link to="/employee/supermarkets" style={{ color: '#FFF' }}> {t('menu.labels.employee.supermarkets')} </Link>}</Nav.Link>
          <Nav.Link as="span">{<Link to="/employee/products" style={{ color: '#FFF' }}> {t('menu.labels.employee.products')} </Link>}</Nav.Link>
        </Nav >
      )
    }
    else {
      return (
        <Nav className="mr-auto">
          <Nav.Link as="span">{<Link to="/customer/supermarkets" style={{ color: '#FFF' }}> {t('menu.labels.customer.supermarkets')} </Link>}</Nav.Link>
          <Nav.Link as="span">{<Link to="/customer/products" style={{ color: '#FFF' }}> {t('menu.labels.customer.products')} </Link>}</Nav.Link>
          <Nav.Link as="span">{<Link to="/customer/orders" style={{ color: '#FFF' }}> {t('menu.labels.customer.orders')} </Link>}</Nav.Link>
        </Nav >
      )
    }
  }

  render() {
    const { i18n } = this.props
    const { t } = this.props;
    const optionAccount = this.state.dataUser.role === 'customer' ? (
      <Nav.Link as="span">{<Link to="/customer/account" style={{ color: 'rgba(255, 255, 255, .5)' }}> {t('menu.labels.customer.account')} </Link>}</Nav.Link>
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
                <Navbar.Brand>{<Link to="/" style={{ color: '#FFF' }}> {t('menu.labels.general.title')} </Link>}</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  {this._optionUser()}
                  <Nav>
                    {optionAccount}
                    <Button variant='link'
                      style={{ color: 'white' }} onClick={() => { this.setState({ isSignup: true }) }}> {t('menu.labels.general.logout')} </Button>
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
                <Route path='/employee/products' exact component={() => <I18nextProvider i18n={i18n}> <ProductsComponentEmployee /> </I18nextProvider>} />
                <Route path='/employee/supermarkets' exact component={() => <I18nextProvider i18n={i18n}> <SupermarketsComponentEmployee /> </I18nextProvider>} />
                <Route path='/customer/orders' exact component={() => <I18nextProvider i18n={i18n}> <OrderComponentCustomer dataUser={this.state.dataUser} /> </I18nextProvider>} />
                <Route path='/customer/supermarkets' exact component={() => <I18nextProvider i18n={i18n}> <SupermarketComponentCustomer dataUser={this.state.dataUser} /> </I18nextProvider>} />
                <Route path='/customer/products' exact component={() => <I18nextProvider i18n={i18n}> <ProductComponentCustomer dataUser={this.state.dataUser} /> </I18nextProvider>} />
                <Route path='/customer/account' exact component={() => <I18nextProvider i18n={i18n}> <AccountComponentCustomer dataUser={this.state.dataUser} /> </I18nextProvider>} />
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
