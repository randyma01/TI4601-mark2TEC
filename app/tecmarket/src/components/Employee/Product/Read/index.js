import React from 'react';
import { Container, Table } from 'react-bootstrap';
import { I18nextProvider, withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';

class Product extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      listProducts: []
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;

    await fetch('http://localhost:8080/v1/employee/findAllProducts',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            listProducts: responseJson
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

  _onClickRefreshProducts = async () => {
    await fetch('http://localhost:8080/v1/employee/findAllProducts',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          this.setState({
            listProducts: responseJson
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const { t } = this.props;
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h3 align='center'> {t('product.labels.read')} </h3>
        </div>
        <div style={{ margin: '5%' }}>
          <IconButton aria-label="refresh" onClick={this._onClickRefreshProducts}>
            <Refresh />
          </IconButton>
          <Table responsive>
            <thead>
              <tr>
                <th>{t('product.data.code')}</th>
                <th>{t('product.data.name')}</th>
                <th>{t('product.data.description')}</th>
                <th>{t('product.data.price')} ($)</th>
                <th>{t('product.data.photo')}</th>
                <th>{t('product.data.supermarket')}</th>
              </tr>
            </thead>
            <tbody>
              {this.state.listProducts.map((item, index) => (
                <tr key={index}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>
                    <img src={item.photo} height='15%' width='15%' alt="product"></img>
                  </td>
                  <td>{item.supermaket}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    );
  }
}


export default withTranslation()(Product);
