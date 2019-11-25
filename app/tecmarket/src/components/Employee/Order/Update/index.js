import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';


class Order extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      order: [],
      orderNumber: '',
      state: ''
    };
  }

  _onClickRefreshProducts = async () => {
    await fetch(`http://localhost:8080/v1/employee/findOneOrder/${this.state.orderNumber}`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          this.setState({
            order: responseJson
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  _handleChangeOrderNumber(event) {
    this.setState({ orderNumber: event.target.value })
  }

  _handleChangeState(event) {
    this.setState({ state: event.target.value })
  }

  _onClickSearchProduct = async () => {
    await fetch(`http://localhost:8080/v1/employee/findOneOrder/${this.state.orderNumber}`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          responseJson["id"] = this.state.orderNumber
          this.setState({
            order: responseJson,
            orderNumber: ''
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  _submitData = async () => {
    const { t } = this.props;
    let data = {
      id: this.state.order.id,
      amount: this.state.order.amount,
      customer: this.state.order.customer,
      date: this.state.order.date,
      products: this.state.order.products,
      state: this.state.state,
      supermarket: this.state.order.supermarket
    }
    await fetch('http://localhost:8080/v1/employee/editProduct',
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.result === 'update') {
          window.confirm(t('product.messages.successUpdate'))
          this.setState({
            order: [],
            state: ''
          })
        }
      })
      .catch(error => {
        console.error(error);
      });
  };


  render() {
    const { t } = this.props;
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h3 align='center'> {t('order.labels.update')} </h3>
        </div>
        <Row className='justify-content-md-center'>
          <Col md='auto'>
            <Form>
              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Row} controlId='formGridCodeSearch'>
                  <Form.Control type='string' placeholder={t('order.labels.orderFind')} value={this.state.orderNumber} onChange={this._handleChangeOrderNumber.bind(this)} />
                </Form.Group>
                <Form.Group as={Col} controlId='formGridCodeSearch'>
                  <IconButton aria-label="search" onClick={this._onClickSearchProduct}>
                    <SearchIcon />
                  </IconButton>
                </Form.Group>
              </Form.Row>
            </Form>
          </Col>
        </Row>
        <div style={{ marginTop: '3%' }}>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId='formGridNumberOrder'>
                <Form.Label> {t('order.data.order')} </Form.Label>
                <Form.Control type='string' value={this.state.order.id} placeholder={t('order.data.order')} disabled />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGriAmount'>
                <Form.Label> {t('order.data.totalAmount')} </Form.Label>
                <Form.Control type='string' placeholder={t('order.data.totalAmount')} value={'$' + this.state.order.amount} disabled />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridDate'>
                <Form.Label> {t('order.data.date')} </Form.Label>
                <Form.Control type='string' placeholder={t('order.data.date')} value={this.state.order.date} disabled />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridProducts'>
                <Form.Label> {t('order.data.products')} </Form.Label>
                <div className='row' style={{ margin: '2%' }} >
                  {
                    Object.keys(this.state.order).includes('products') ? this.state.order.products.map((product, pIndex) =>
                      <div key={pIndex} style={{ marginTop: '2%' }}>
                        {t('product.data.code')}: {' '} {product.code}{' '} | {' '}
                        {t('product.data.description')}: {' '}{product.description} {' '} | {' '}
                        {t('product.data.name')}: {' '}{product.name}{' '} | {' '}
                        {t('order.data.need')}: {' '}{product.need}{' '} | {' '}
                        {t('product.data.price')}: {' '}{product.price} {' '} | {' '}
                        {t('order.data.amount')}: {' $ '}{product.amount} {' '}
                        <br />
                      </div>
                    ) : null
                  }
                </div>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridState'>
                <Form.Label> {t('order.data.state')} </Form.Label>
                <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeState.bind(this)}>
                  <option value={'DEFAULT'} disabled hidden>{this.state.order.state}</option>
                  <option value={'Registered'} key='1'> {t('order.state.registered')}</option>
                  <option value={'Assigned'} key='2'> {t('order.state.assigned')}</option>
                  <option value={'on Route'} key='3'> {t('order.state.onRoute')}</option>
                  <option value={'Delivered'} key='4'> {t('order.state.delivered')}</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row className='justify-content-center'>
              <Button variant='success' size='lg'>
                {t('order.labels.update')}
              </Button>
            </Form.Row>

          </Form>
        </div>
      </Container>
    );
  }
}


export default withTranslation()(Order);
