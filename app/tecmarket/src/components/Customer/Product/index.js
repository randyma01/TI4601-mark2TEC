import React from 'react';
import { Button, Container, Card, Form, Modal, Row, Table } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import LanguageIcon from '@material-ui/icons/Language';
import PhoneIcon from '@material-ui/icons/Phone';
import StarIcon from '@material-ui/icons/Star';
import TodayIcon from '@material-ui/icons/Today';

class NewOrder extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      orderProducts: [],
      amount: '',
      dataUser: props.dataUser,
      need: '',
      supermarketId: '',
      totalAmount: 0,
      listSupermarkets: [],
      listProductsBySupermarket: []
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    await fetch('http://localhost:8080/v1/employee/findAllSupermarkets',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            listSupermarkets: responseJson
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

  _handleChangeAmount(event) {
    this.setState({ amount: event.target.value });
  }

  _handleChangeNeed(event) {
    this.setState({ need: event.target.value });
  }

  _onClickAddOrder(supermarketId) {
    const { t } = this.props;
    const verify = window.confirm(t('order.messages.confirmAdd'))
    if (verify) {
      fetch(`http://localhost:8080/v1/customer/findProductBySupermarket/${supermarketId}`,
        {
          method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson !== '' && this._isMounted) {
            this.setState({
              listProductsBySupermarket: responseJson,
              supermarketId: supermarketId,
              showBuyProducts: !this.state.showBuyProducts
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  _onClickAddProduct = async (product) => {
    const { t } = this.props;
    if (this.state.amount === '') {
      window.confirm(t('product.messages.errorEmptyData'))
    } else {
      let amount = this.state.amount;
      let need = this.state.need;
      product['amount'] = amount;
      product['need'] = need;
      let totalAmountByProduct = product.amount * product.price;
      await this.setState({
        amount: '', need: '',
        totalAmount: this.state.totalAmount + totalAmountByProduct,
        orderProducts: [...this.state.orderProducts, product]
      })
    }
  }

  _onClickDeleteProduct(product) {
    this.setState(state => {
      const orderProducts = state.orderProducts.filter(item => item.code !== product);
      return {
        orderProducts
      };
    });
  }

  _submitData = async () => {
    const { t } = this.props;
    if (this.state.orderProducts.length <= 0) {
      window.confirm(t('order.messages.errorEmptyOrder'))
    } else {
      const verify = window.confirm(t('order.messages.confirmOrder'))
      if (verify) {
        let data = {
          customer: this.state.dataUser.id,
          products: this.state.orderProducts,
          supermarketId: this.state.supermarketId,
          totalAmount: this.state.totalAmount,
        }
        fetch('http://localhost:8080/v1/customer/addOrder',
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.result !== '') {
              let message = t('order.messages.successAdd');
              window.confirm(`${message} ${responseJson.result}`)
              this.setState({
                showBuyProducts: !this.state.showBuyProducts,
                product: [],
                orderProducts: [],
                amount: '',
                need: '',
                totalAmount: 0,
                listProductsBySupermarket: []
              })
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };

  _onShowModal() {
    const { t } = this.props;
    return (
      <Modal
        show={this.state.showBuyProducts}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {t('order.labels.create')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card-columns">
            {this.state.listProductsBySupermarket.map((item, index) => (
              <Card style={{ width: '15rem', marginTop: '2%' }} key={index}>
                <Card.Img variant="top" style={{ height: '50%', width: '50%' }} src={item.photo} />
                <Card.Body>
                  <Card.Title>{item.name} : {item.code}</Card.Title>
                  <Card.Text>
                    <div>
                      <footer className="blockquote-footer" id="code">
                        <strong>{t('order.data.description')}:</strong>
                        <p style={{ fontSize: '125%' }}>  {item.description}</p>
                      </footer>
                    </div>
                    <div>
                      <footer className="blockquote-footer" id="description">
                        <strong>{t('order.data.price')}:</strong>
                        <p style={{ fontSize: '125%' }}> $ {item.price} </p>
                      </footer>
                    </div>
                  </Card.Text>
                  <Form>
                    <Form.Row>
                      <Form.Group as={Row} controlId='formGridAmount' key={index}>
                        <Form.Control key={index} type='number' placeholder={t('order.data.amount')} onChange={this._handleChangeAmount.bind(this)} />
                      </Form.Group>
                      <Form.Group as={Row} controlId='formGridNeed' key={index}>
                        <Form.Control key={index} type='string' placeholder={t('order.data.need')} onChange={this._handleChangeNeed.bind(this)} />
                      </Form.Group>
                    </Form.Row>
                  </Form>
                </Card.Body>
                <Card.Footer>
                  <div className='row justify-content-center' style={{ margin: '2%' }}>
                    <Button variant="success" onClick={this._onClickAddProduct.bind(this, item)} >{t('order.buttons.addProduct')}</Button>
                  </div>
                </Card.Footer>
              </Card>
            ))}
          </div>
          <div style={{ marginTop: '4%', marginBottom: '3%' }}>
            {t('order.labels.detailOrder')}
            <Table responsive>
              <thead>
                <tr>
                  <th>{t('product.data.code')}</th>
                  <th>{t('product.data.name')}</th>
                  <th>{t('product.data.price')} ($)</th>
                  <th>{t('order.data.amount')}</th>
                  <th>{t('order.labels.removeProduct')}</th>
                </tr>
              </thead>
              <tbody>
                {this.state.orderProducts.map((item, index) => (
                  <tr key={index}>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.amount}</td>
                    <td>
                      <IconButton aria-label="delete" style={{ color: 'red' }} onClick={this._onClickDeleteProduct.bind(this, item.code)}>
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className='text-sm-right'>
              {t('order.labels.totalAmount')} {this.state.totalAmount}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className='justify-content-center'>
          <Button variant="secondary" onClick={() => {
            this.setState({
              showBuyProducts: !this.state.showBuyProducts,
              product: [],
              orderProducts: [],
              amount: '',
              need: '',
              totalAmount: 0,
              listProductsBySupermarket: []
            })
          }}>
            {t('product.buttons.addCancel')}
          </Button>
          <Button variant="primary" onClick={this._submitData}>
            {t('product.buttons.addConfirm')}
          </Button>
        </Modal.Footer>

      </Modal>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h3 align='center'>{t('order.labels.create')}</h3>
        </div>
        <div className="card-columns">
          {this.state.listSupermarkets.map((item, index) => (
            <Card style={{ width: '18rem' }} key={index}>
              <Card.Img variant="top" src={item.photo} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  <div>
                    <footer className="blockquote-footer" id="address">
                      <strong>{t('supermarket.data.address')}:</strong>
                      <p style={{ fontSize: '125%' }}> {item.address} | {item.latitude} , {item.longitude} </p>
                    </footer>
                  </div>
                  <div>
                    <footer className="blockquote-footer" id="description">
                      <strong>{t('supermarket.data.description')}:</strong>
                      <p style={{ fontSize: '125%' }}> {item.description} </p>
                    </footer>
                  </div>
                </Card.Text>
                <Card.Text>
                  <footer className="blockquote-footer">
                    <strong>{t('supermarket.data.schedule')}:</strong> <cite title={item.schedule}> <TodayIcon fontSize='large' /> </cite>
                  </footer>
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <div className='row row-fluid'>
                  <div className='col'>
                    <small className="text-muted col-3">
                      <StarIcon fontSize='small' />{item.rating}  <div></div>
                      <LanguageIcon fontSize='small' /> <a href={item.website}>{item.website}</a> <div></div>
                      <PhoneIcon fontSize='small' />{item.phone}
                    </small>
                  </div>
                </div>
                <div className='row justify-content-center' style={{ margin: '2%' }}>
                  <Button variant="success" onClick={this._onClickAddOrder.bind(this, item.id)} >{t('order.buttons.addOrder')}</Button>
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
        {this._onShowModal()}
      </Container>
    );
  }
}

export default withTranslation()(NewOrder);
