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
      listOrders: []
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;

    await fetch('http://localhost:8080/v1/employee/findAllOrders',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            listOrders: responseJson
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
    await fetch('http://localhost:8080/v1/employee/findAllOrders',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          this.setState({
            listOrders: responseJson
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
          <Table responsive striped bordered hover size='sm'>
            <thead>
              <tr>
                <th>{t('order.data.order')}</th>
                <th>{t('order.data.date')}</th>
                <th>{t('order.data.state')}</th>
                <th>{t('order.data.supermarket')}</th>
                <th>{t('order.data.totalAmount')}</th>
                <th>{t('order.data.products')}</th>
              </tr>
            </thead>
            <tbody>
              {this.state.listOrders.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.date}</td>
                  <td>{item.state}</td>
                  <td>{item.supermarket}</td>
                  <td>$ {item.amount}</td>
                  <td>{item.products.map((product, pIndex) =>
                    <div key={pIndex} style={{ marginTop: '2%' }}>
                      {t('product.data.code')}: {' '} {product.code}{' '} | {' '}
                      {t('product.data.description')}: {' '}{product.description} {' '} | {' '}
                      {t('product.data.name')}: {' '}{product.name}{' '} | {' '}
                      {t('order.data.need')}: {' '}{product.need}{' '} | {' '}
                      {t('product.data.price')}: {' '}{product.price} {' '} | {' '}
                      {t('order.data.amount')}: {' $ '}{product.amount} {' '}
                      <br />
                    </div>
                  )}
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


export default withTranslation()(Product);
