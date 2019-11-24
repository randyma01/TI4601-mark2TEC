import React from 'react';
import { Container, Table } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

/*Tabs*/


class MyOrder extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      state: '',
      dataUser: props.dataUser,
      listMyOrders: []
    }
  }

  componentDidMount = async () => {
    this._isMounted = true;
    await fetch(`http://localhost:8080/v1/customer/viewOrder/${this.state.dataUser.id}`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            listMyOrders: responseJson
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
    const { t } = this.props;
    return (
      <Container style={{ marginTop: '6%' }}>
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
            {this.state.listMyOrders.map((item, index) => (
              <tr key={index}>
                <td>{index}</td>
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
      </Container>
    );
  }
}


export default withTranslation()(MyOrder);;
