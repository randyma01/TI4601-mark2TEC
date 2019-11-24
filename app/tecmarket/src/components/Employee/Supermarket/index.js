import React from 'react';
import { Button, Col, Container, Form, Modal, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { I18nextProvider, withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import IconButton from '@material-ui/core/IconButton';

/*Tabs*/
import DeleteSupermarket from './Delete';
import ReadSupermarket from './Read';
import UpdateSupermarket from './Update';

class Supermarket extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      description: '',
      latitude: '',
      longitude: '',
      name: '',
      phone: '',
      photo: '',
      rating: '',
      schedule: '',
      showAddSuper: false,
      supermarkets: [],
      urlWebsite: ''
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    //TODO
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _handleChangeFindAddress = async (event) => {
    try {
      this.setState({ address: event.target.value })
      await fetch(`http://localhost:8080/v1/findPredictions/${event.target.value}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          responseJson.length !== 0 ? this.setState({
            supermarkets: responseJson,
            latitude: '', longitude: '',
            isNotResultPrediction: false,
            isResultGeo: false
          }) : this.setState({ isNotResultPrediction: true });
        })
        .catch(error => {
          console.error(error);
        });

      if (this.state.isNotResultPrediction) {
        await fetch(`http://localhost:8080/v1/findByAddress/${this.state.address}`,
          {
            method: "GET",
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson !== []) {
              this.setState({
                supermarkets: responseJson,
                latitude: '', longitude: '',
                isNotResultPrediction: false,
                isResultGeo: true
              })
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    } catch (error) {
      console.log(error)
    }

  }

  _handleChangeAddress(event) {
    this.setState({ address: event.target.value })
  }

  _handleChangeDescription(event) {
    this.setState({ description: event.target.value })
  }

  _handleChangeLatitude(event) {
    this.setState({ latitude: event.target.value })
  }

  _handleChangeLongitude(event) {
    this.setState({ longitude: event.target.value })
  }

  _handleChangeName(event) {
    this.setState({ name: event.target.value })
  }

  _handleChangePhone(event) {
    this.setState({ phone: event.target.value })
  }

  _handleChangePhoto(event) {
    this.setState({ photo: event.target.value })
  }

  _handleChangeRating(event) {
    this.setState({ rating: event.target.value })
  }

  _handleChangeSchedule(event) {
    this.setState({ schedule: event.target.value })
  }

  _handleChangeWebSite(event) {
    this.setState({ urlWebsite: event.target.value })
  }


  _onClickAddSupermarket = async (supermarketId, address) => {
    await fetch(`http://localhost:8080/v1/detailPlace/${supermarketId}`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          this.setState({
            supermarketData: responseJson,
            showAddSuper: !this.state.showAddSuper,
            address: address,
            description: Object.keys(responseJson).includes("vicinity") ? responseJson.vicinity : '',
            latitude: Object.keys(responseJson).includes("geometry") ? responseJson.geometry.location.lat : '',
            longitude: Object.keys(responseJson).includes("geometry") ? responseJson.geometry.location.lng : '',
            name: Object.keys(responseJson).includes("name") ? responseJson.name : '',
            phone: Object.keys(responseJson).includes("international_phone_number") ? responseJson.international_phone_number : '',
            photo: Object.keys(responseJson).includes("photos") ? responseJson.photos[0].photo_reference : '',
            rating: Object.keys(responseJson).includes("rating") ? responseJson.rating : '',
            schedule: Object.keys(responseJson).includes("opening_hours") ? JSON.stringify(responseJson.opening_hours.weekday_text) : '',
            urlWebsite: Object.keys(responseJson).includes("website") ? responseJson.website : ''
          });
        }
      })
      .catch(error => {
        console.error(error);
      });

    //get URL Photo
    if (this.state.photo !== '') {
      await fetch(`http://localhost:8080/v1/detailPlacePhoto/${this.state.photo}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            photo: responseJson.url
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }


  _onClickFindLatLng = async () => {
    const { t } = this.props;
    if (this.state.latitude === '' || this.state.longitude === '') {
      window.confirm(t('supermarket.messages.errorEmptyAddress'))
    } else {
      let data = {
        latitude: this.state.latitude,
        longitude: this.state.longitude
      }
      await fetch('http://localhost:8080/v1/findByLatLng',
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson !== '') {
            this.setState({
              supermarkets: responseJson,
              address: '',
              isNotResultPrediction: false,
              isResultGeo: true
            })
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }


  _submitData = async () => {
    const { t } = this.props;
    let data = {
      address: this.state.address,
      description: this.state.description,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      name: this.state.name,
      phone: this.state.phone,
      photo: this.state.photo,
      rating: this.state.rating,
      schedule: this.state.schedule,
      urlWebsite: this.state.urlWebsite
    }
    await fetch('http://localhost:8080/v1/employee/addSupermarket',
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
          window.confirm(t('supermarket.messages.successAdd'))
          this.setState({
            showAddSuper: !this.state.showAddSuper,
            address: '',
            description: '',
            latitude: '',
            longitude: '',
            name: '',
            phone: '',
            photo: '',
            rating: '',
            schedule: '',
            urlWebsite: '',
            supermarkets: []
          })
        }
      })
      .catch(error => {
        console.error(error);
      });
  };


  _onShowModal() {
    const { t } = this.props;
    return (
      <Modal
        show={this.state.showAddSuper}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {t('supermarket.labels.create')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId='formGridLat'>
                <Form.Label>{t('supermarket.data.latitude')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.latitude')} value={this.state.latitude} onChange={this._handleChangeLatitude.bind(this)} />
              </Form.Group>

              <Form.Group as={Col} controlId='formGridLng'>
                <Form.Label>{t('supermarket.data.longitude')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.longitude')} value={this.state.longitude} onChange={this._handleChangeLongitude.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridAddress'>
                <Form.Label>{t('supermarket.data.address')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.address')} value={this.state.address} onChange={this._handleChangeAddress.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridName'>
                <Form.Label>{t('supermarket.data.name')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.name')} value={this.state.name} onChange={this._handleChangeName.bind(this)} />
              </Form.Group>
              <Form.Group as={Col} controlId='formGridDescript'>
                <Form.Label>{t('supermarket.data.description')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.description')} value={this.state.description} onChange={this._handleChangeDescription.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridPhone'>
                <Form.Label>{t('supermarket.data.phone')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.phone')} value={this.state.phone} onChange={this._handleChangePhone.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridRating'>
                <Form.Label>{t('supermarket.data.rating')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.rating')} value={this.state.rating} onChange={this._handleChangeRating.bind(this)} />
              </Form.Group>

              <Form.Group as={Col} controlId='formGridWebsite'>
                <Form.Label>{t('supermarket.data.website')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.website')} value={this.state.urlWebsite} onChange={this._handleChangeWebSite.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridSchedule'>
                <Form.Label>{t('supermarket.data.schedule')}</Form.Label>
                <Form.Control type="string" placeholder={t('supermarket.data.schedule')} value={this.state.schedule} onChange={this._handleChangeSchedule.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridPhoto'>
                <Form.Label>{t('supermarket.data.photo')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.photo')} value={this.state.photo} onChange={this._handleChangePhoto.bind(this)} />
                <div style={{ textAlign: 'center' }}>
                  <img style={{ margin: '2%' }} src={this.state.photo} height='25%' width='25%' alt="supermarket"></img>
                </div>
              </Form.Group>
            </Form.Row>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            this.setState({
              showAddSuper: !this.state.showAddSuper,
              address: '',
              description: '',
              latitude: '',
              longitude: '',
              name: '',
              phone: '',
              photo: '',
              rating: '',
              schedule: '',
              urlWebsite: ''
            })
          }}>
            {t('supermarket.buttons.cancelAddSupermarket')}
          </Button>
          <Button variant="primary" onClick={this._submitData}>
            {t('supermarket.buttons.addSupermarket')}
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
              <h3 align='center'> {t('supermarket.labels.create')} </h3>
            </div>
            <Row className='justify-content-md-center'>
              <Col xs lg='2'></Col>
              <Col md='auto'>
                <Form>
                  <Form.Row style={{ marginTop: '2%' }}>
                    <Form.Group as={Col} controlId='formGridLat'>
                      <Form.Control type='string' placeholder={t('supermarket.data.latitude')} value={this.state.latitude} onChange={this._handleChangeLatitude.bind(this)} />
                    </Form.Group>
                    <Form.Group as={Col} controlId='formGridLng'>
                      <Form.Control type='string' placeholder={t('supermarket.data.longitude')} value={this.state.longitude} onChange={this._handleChangeLongitude.bind(this)} />
                    </Form.Group>
                    <Form.Group as={Col} controlId='formGriButtonFind'>
                      <Button
                        variant='primary'
                        size='sm'
                        onClick={this._onClickFindLatLng}
                      >
                        {t('supermarket.buttons.findOnLatLong')}
                      </Button>
                    </Form.Group>
                  </Form.Row>

                  <Form.Row style={{ marginTop: '2%' }}>
                    <Form.Group as={Col} controlId='formGridAddress'>
                      <Form.Control type='string' placeholder={t('supermarket.data.address')} value={this.state.address} onChange={this._handleChangeFindAddress.bind(this)} />
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Col>
              <Col xs lg='2'></Col>
            </Row>
            <Row className='justify-content-md-center' style={{ margin: '3%' }}>
              <Table responsive>
                <thead>
                  <tr>
                    <th>{t('supermarket.labels.tableName')}</th>
                    <th>{t('supermarket.labels.tableDescription')}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.supermarkets.map((item, index) => (
                    <tr key={index}>
                      <td>{this.state.isResultGeo ? item.address_components[0].long_name : item.structured_formatting.main_text}</td>
                      <td>{this.state.isResultGeo ? item.formatted_address : item.description}</td>
                      <td>
                        <IconButton aria-label="add" style={{ color: '#328da8' }} onClick={this._onClickAddSupermarket.bind(this, item.place_id, this.state.isResultGeo ? item.formatted_address : item.description)}>
                          <AddShoppingCartIcon fontSize='large' />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
            <div>
              {this._onShowModal()}
            </div>
          </Tab>
          <Tab eventKey="read" title="R">
            <I18nextProvider i18n={i18n}>
              <ReadSupermarket />
            </I18nextProvider>
          </Tab>
          <Tab eventKey="update" title="U" >
            <I18nextProvider i18n={i18n}>
              <UpdateSupermarket />
            </I18nextProvider>
          </Tab>
          <Tab eventKey="delete" title="D" >
            <I18nextProvider i18n={i18n}>
              <DeleteSupermarket />
            </I18nextProvider>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}


export default withTranslation()(Supermarket);
