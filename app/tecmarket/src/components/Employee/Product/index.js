import React from 'react';
import { Button, Card, Col, Container, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { I18nextProvider, withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

/*Tabs*/
import DeleteProduct from './Delete';
import ReadProduct from './Read';
import UpdateProduct from './Update';

class Product extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      description: '',
      listSupermarkets: [],
      name: '',
      photo: '',
      price: '',
      supermarketId: ''
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

  _handleChangeCode(event) {
    this.setState({ code: event.target.value })
  }

  _handleChangeDescription(event) {
    this.setState({ description: event.target.value })
  }

  _handleChangeName(event) {
    this.setState({ name: event.target.value })
  }

  _handleChangePhoto(event) {
    this.setState({ photo: event.target.value })
  }

  _handleChangePrice(event) {
    this.setState({ price: event.target.value })
  }

  _onClickAddProduct(superId) {
    const { t } = this.props;
    const verify = window.confirm(t('product.messages.confirmAdd'))
    if (verify) {
      this.setState({
        supermarketId: superId,
        showAddProduct: !this.state.showAddProduct
      });
    }
  }

  _submitData = async () => {
    const { t } = this.props;
    if (this.state.name === '' || this.state.code || this.state.description
      || this.state.price || this.state.photo) {
      window.confirm(t('product.messages.errorEmptyData'))
    }
    else {
      let data = {
        code: this.state.code,
        description: this.state.description,
        name: this.state.name,
        photo: this.state.photo,
        price: this.state.price,
        supermarketId: this.state.supermarketId
      }
      await fetch('http://localhost:8080/v1/employee/addProduct',
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.result === 'add') {
            window.confirm(t('product.messages.successAdd'))
            this.setState({
              showAddProduct: !this.state.showAddProduct,
              code: '',
              description: '',
              name: '',
              photo: '',
              price: '',
              supermarketId: ''
            })
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  _onShowModal() {
    const { t } = this.props;
    return (
      <Modal
        show={this.state.showAddProduct}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {t('product.labels.create')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridSuper'>
                <Form.Control type='string' value={`${t('product.data.supermarket')}: ${this.state.supermarketId}`} disabled />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridCode'>
                <Form.Label>{t('product.data.code')}</Form.Label>
                <Form.Control type='string' placeholder={t('product.data.code')} onChange={this._handleChangeCode.bind(this)} />
              </Form.Group>

              <Form.Group as={Col} controlId='formGridName'>
                <Form.Label>{t('product.data.name')}</Form.Label>
                <Form.Control type='string' placeholder={t('product.data.name')} onChange={this._handleChangeName.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGriDescript'>
                <Form.Label>{t('product.data.description')}</Form.Label>
                <Form.Control type='string' placeholder={t('product.data.description')} onChange={this._handleChangeDescription.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridPrice'>
                <Form.Label>{t('product.data.price')}($)</Form.Label>
                <Form.Control type='number' placeholder={t('product.data.price')} onChange={this._handleChangePrice.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridPhoto'>
                <Form.Label>{t('product.data.photo')}</Form.Label>
                <Form.Control type='string' placeholder={t('product.data.photo')} onChange={this._handleChangePhoto.bind(this)} />
                <div style={{ textAlign: 'center' }}>
                  <img style={{ margin: '2%' }} src={this.state.photo} height='25%' width='25%' alt="product"></img>
                </div>
              </Form.Group>
            </Form.Row>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            this.setState({
              showAddProduct: !this.state.showAddProduct,
              code: '',
              description: '',
              name: '',
              photo: '',
              price: '',
              supermarketId: ''
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
    const { i18n } = this.props
    const { t } = this.props;
    return (
      <Container>
        <Tabs defaultActiveKey="create" id="uncontrolled-tab-example">
          <Tab eventKey="create" title="C">
            <div style={{ margin: '2%' }}>
              <h3 align='center'> {t('product.labels.create')} </h3>
            </div>
            <div style={{ margin: '5%' }}>
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
                    </Card.Body>
                    <Card.Footer>
                      <Button variant="success" onClick={this._onClickAddProduct.bind(this, item.id)} >{t('product.buttons.addProduct')}</Button>
                    </Card.Footer>
                  </Card>
                ))}
              </div>
              {this._onShowModal()}
            </div>
          </Tab>
          <Tab eventKey="read" title="R">
            <I18nextProvider i18n={i18n}>
              <ReadProduct />
            </I18nextProvider>
          </Tab>
          <Tab eventKey="update" title="U" >
            <I18nextProvider i18n={i18n}>
              <UpdateProduct />
            </I18nextProvider>
          </Tab>
          <Tab eventKey="delete" title="D" >
            <I18nextProvider i18n={i18n}>
              <DeleteProduct />
            </I18nextProvider>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}


export default withTranslation()(Product)
