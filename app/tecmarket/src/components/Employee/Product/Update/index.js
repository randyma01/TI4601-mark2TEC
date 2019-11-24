import React from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';


class Product extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      code: '',
      description: '',
      listProducts: [],
      name: '',
      photo: '',
      price: '',
      supermarketId: ''
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

  _handleChangeCodeFind(event) {
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

  _onClickSearchProduct = async () => {
    const { t } = this.props;
    if (this.state.code === '') {
      window.confirm(t('product.messages.errorEmptyCode'))
    } else {
      await fetch(`http://localhost:8080/v1/employee/findOneProduct/${this.state.code}`,
        {
          method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson !== '') {
            this.setState({
              code: responseJson.code,
              description: responseJson.description,
              name: responseJson.name,
              photo: responseJson.photo,
              price: parseInt(responseJson.price),
              supermarketId: responseJson.supermarket,
              showEditProduct: !this.state.showEditProduct
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
      console.log(this.state.price)
      console.log(this.state.name)
      console.log(this.state.description)
      console.log(this.state.photo)
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
              showEditProduct: !this.state.showEditProduct,
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
        show={this.state.showEditProduct}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {t('product.labels.update')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId='formGridSuper'>
                <Form.Control type='string' value={`${t('product.data.supermarket')}: ${this.state.supermarketId}`} disabled />
              </Form.Group>

              <Form.Group as={Col} controlId='formGridCode'>
                <Form.Control type='string' value={`${t('product.data.code')}: ${this.state.code}`} disabled />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridName'>
                <Form.Label>{t('product.data.name')}</Form.Label>
                <Form.Control type='string' value={this.state.name} onChange={this._handleChangeName.bind(this)} />
              </Form.Group>

              <Form.Group as={Col} controlId='formGriDescript'>
                <Form.Label>{t('product.data.description')}</Form.Label>
                <Form.Control type='string' value={this.state.description} onChange={this._handleChangeDescription.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridPrice'>
                <Form.Label>{t('product.data.price')}($)</Form.Label>
                <Form.Control type='number' value={this.state.price} onChange={this._handleChangePrice.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridPhoto'>
                <Form.Label>{t('product.data.photo')}</Form.Label>
                <Form.Control type='string' value={this.state.photo} onChange={this._handleChangePhoto.bind(this)} />
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
              showEditProduct: !this.state.showEditProduct,
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
    const { t } = this.props;
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h3 align='center'> {t('product.labels.update')} </h3>
        </div>
        <Row className='justify-content-md-center'>
          <Col md='auto'>
            <Form>
              <Form.Row style={{ marginTop: '2%' }}>
                <Form.Group as={Row} controlId='formGridCodeSearch'>
                  <Form.Control type='string' placeholder={t('product.data.codeFind')} value={this.state.code} onChange={this._handleChangeCodeFind.bind(this)} />
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
        {this._onShowModal()}
      </Container>
    );
  }
}


export default withTranslation()(Product);
